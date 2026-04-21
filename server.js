// Zero-dependency static server for Nuvexa Studio on Railway.
// Bulletproof: catches every error, never crashes the process.

const http = require('http');
const fs = require('fs');
const path = require('path');

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

function safeResolve(reqPath) {
  try {
    const decoded = decodeURIComponent(reqPath.split('?')[0].split('#')[0]);
    const normalized = path.posix.normalize(decoded);
    if (normalized.includes('..')) return null;
    const target = path.join(ROOT, normalized);
    if (!target.startsWith(ROOT)) return null;
    return target;
  } catch (_) {
    return null;
  }
}

function send(res, status, body, extraHeaders = {}) {
  if (res.headersSent) { try { res.end(); } catch (_) {} return; }
  try {
    res.writeHead(status, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      ...SECURITY_HEADERS,
      ...extraHeaders
    });
    res.end(body);
  } catch (_) { try { res.end(); } catch (__) {} }
}

function serveFile(res, filePath) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, 'Not found');
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const cache = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
    try {
      res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': stat.size,
        'Cache-Control': cache,
        ...SECURITY_HEADERS
      });
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => { try { res.end(); } catch (_) {} });
      stream.pipe(res);
    } catch (_) {
      send(res, 500, 'Server error');
    }
  });
}

const server = http.createServer((req, res) => {
  try {
    // Only allow GET/HEAD
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return send(res, 405, 'Method not allowed', { 'Allow': 'GET, HEAD' });
    }

    let urlPath = (req.url || '/').split('?')[0].split('#')[0];
    if (urlPath === '' || urlPath === '/') urlPath = '/index.html';

    // Block dotfiles and sensitive paths
    const segments = urlPath.split('/').filter(Boolean);
    if (segments.some(s => BLOCKED.has(s) || (s.startsWith('.') && s !== '.well-known'))) {
      return send(res, 404, 'Not found');
    }

    const filePath = safeResolve(urlPath);
    if (!filePath) return send(res, 400, 'Bad request');

    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isFile()) return serveFile(res, filePath);

      // Clean-URL: try appending .html (for /about -> about.html)
      if (!/\.[a-z0-9]+$/i.test(urlPath)) {
        const htmlPath = filePath.replace(/\/$/, '') + '.html';
        return fs.stat(htmlPath, (err2, stat2) => {
          if (!err2 && stat2.isFile()) return serveFile(res, htmlPath);
          return send(res, 404, 'Not found');
        });
      }

      // Asset request with extension that doesn't exist -> 404
      return send(res, 404, 'Not found');
    });
  } catch (e) {
    console.error('[request error]', e);
    send(res, 500, 'Internal server error');
  }
});

server.on('clientError', (err, socket) => {
  try { socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); } catch (_) {}
});

process.on('uncaughtException', (e) => console.error('[uncaught]', e));
process.on('unhandledRejection', (e) => console.error('[unhandled]', e));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Nuvexa server listening on 0.0.0.0:${PORT}`);
});
