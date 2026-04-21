// Zero-dependency static server for Nuvexa Studio on Railway.
// Fast: in-memory file cache + gzip/brotli compression + long cache headers.
// Bulletproof: every handler wrapped; no request can crash the process.

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = __dirname;
const PORT = parseInt(process.env.PORT, 10) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.otf':  'font/otf',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml',
  '.map':  'application/json; charset=utf-8'
};

const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.txt', '.xml', '.map']);

const BLOCKED = new Set([
  'node_modules', '.git', '.env', '.env.local',
  'package.json', 'package-lock.json',
  'server.js', 'serve.json', '.gitignore'
]);

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN'
};

// In-memory cache: filePath -> { buf, br, gz, mtime, type }
const CACHE = new Map();

function safeResolve(reqPath) {
  try {
    const decoded = decodeURIComponent(reqPath.split('?')[0].split('#')[0]);
    const normalized = path.posix.normalize(decoded);
    if (normalized.includes('..')) return null;
    const target = path.join(ROOT, normalized);
    if (!target.startsWith(ROOT)) return null;
    return target;
  } catch (_) { return null; }
}

function send(res, status, body, extraHeaders = {}) {
  if (res.headersSent) { try { res.end(); } catch (_) {} return; }
  try {
    const buf = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
    res.writeHead(status, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': buf.length,
      ...SECURITY_HEADERS,
      ...extraHeaders
    });
    res.end(buf);
  } catch (_) { try { res.end(); } catch (__) {} }
}

function loadIntoCache(filePath) {
  return new Promise((resolve) => {
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) return resolve(null);
      fs.readFile(filePath, (err2, buf) => {
        if (err2) return resolve(null);
        const ext = path.extname(filePath).toLowerCase();
        const type = MIME[ext] || 'application/octet-stream';
        const entry = { buf, mtime: stat.mtimeMs, type, ext };
        if (COMPRESSIBLE.has(ext) && buf.length > 256) {
          try { entry.gz = zlib.gzipSync(buf, { level: 6 }); } catch (_) {}
          try { entry.br = zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }); } catch (_) {}
        }
        CACHE.set(filePath, entry);
        resolve(entry);
      });
    });
  });
}

async function getEntry(filePath) {
  const cached = CACHE.get(filePath);
  if (cached) {
    // Validate mtime lazily (non-blocking)
    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isFile() && stat.mtimeMs !== cached.mtime) CACHE.delete(filePath);
    });
    return cached;
  }
  return loadIntoCache(filePath);
}

function cacheControl(ext) {
  if (ext === '.html') return 'public, max-age=300, must-revalidate';
  if (ext === '.css' || ext === '.js') return 'public, max-age=86400';
  if (['.woff', '.woff2', '.ttf', '.otf', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'].includes(ext))
    return 'public, max-age=604800, immutable';
  return 'public, max-age=3600';
}

function pickEncoding(acceptEncoding, entry) {
  if (!acceptEncoding) return null;
  const ae = acceptEncoding.toLowerCase();
  if (entry.br && ae.includes('br')) return { name: 'br', data: entry.br };
  if (entry.gz && ae.includes('gzip')) return { name: 'gzip', data: entry.gz };
  return null;
}

async function serveFile(req, res, filePath) {
  const entry = await getEntry(filePath);
  if (!entry) return send(res, 404, 'Not found');

  const enc = pickEncoding(req.headers['accept-encoding'], entry);
  const body = enc ? enc.data : entry.buf;

  const headers = {
    'Content-Type': entry.type,
    'Content-Length': body.length,
    'Cache-Control': cacheControl(entry.ext),
    'Vary': 'Accept-Encoding',
    ...SECURITY_HEADERS
  };
  if (enc) headers['Content-Encoding'] = enc.name;

  try {
    res.writeHead(200, headers);
    if (req.method === 'HEAD') res.end(); else res.end(body);
  } catch (_) { try { res.end(); } catch (__) {} }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return send(res, 405, 'Method not allowed', { 'Allow': 'GET, HEAD' });
    }

    let urlPath = (req.url || '/').split('?')[0].split('#')[0];
    if (urlPath === '' || urlPath === '/') urlPath = '/index.html';

    const segments = urlPath.split('/').filter(Boolean);
    if (segments.some(s => BLOCKED.has(s) || (s.startsWith('.') && s !== '.well-known'))) {
      return send(res, 404, 'Not found');
    }

    const filePath = safeResolve(urlPath);
    if (!filePath) return send(res, 400, 'Bad request');

    const entry = await getEntry(filePath);
    if (entry) return serveFile(req, res, filePath);

    // Clean-URL fallback: /about -> about.html
    if (!/\.[a-z0-9]+$/i.test(urlPath)) {
      const htmlPath = filePath.replace(/\/$/, '') + '.html';
      const htmlEntry = await getEntry(htmlPath);
      if (htmlEntry) return serveFile(req, res, htmlPath);
    }

    return send(res, 404, 'Not found');
  } catch (e) {
    console.error('[request error]', e);
    send(res, 500, 'Internal server error');
  }
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.on('clientError', (err, socket) => {
  try { socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); } catch (_) {}
});

process.on('uncaughtException', (e) => console.error('[uncaught]', e));
process.on('unhandledRejection', (e) => console.error('[unhandled]', e));

// Warm cache for static files at boot (faster first request)
(async () => {
  try {
    const entries = fs.readdirSync(ROOT);
    await Promise.all(entries
      .filter(f => !BLOCKED.has(f) && !f.startsWith('.'))
      .map(f => {
        const p = path.join(ROOT, f);
        try { if (fs.statSync(p).isFile()) return loadIntoCache(p); } catch (_) {}
        return null;
      }));
    console.log(`[warm] cached ${CACHE.size} files`);
  } catch (e) { console.error('[warm error]', e); }
})();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Nuvexa server listening on 0.0.0.0:${PORT}`);
});
