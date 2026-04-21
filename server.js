// Minimal static file server for Railway deployment.
// No external dependencies. Serves index.html by default and resolves .html
// extensions so /about, /services, /contact, /courses all work.

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml'
};

const BLOCKED = new Set(['node_modules', '.git', '.env', '.env.local', 'package.json', 'package-lock.json', 'server.js', 'serve.json']);

function safeJoin(root, reqPath) {
  const decoded = decodeURIComponent(reqPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[\/\\])+/, '');
  const target = path.join(root, normalized);
  if (!target.startsWith(root)) return null;
  return target;
}

function send(res, status, headers, body) {
  res.writeHead(status, {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    ...headers
  });
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => send(res, 500, { 'Content-Type': 'text/plain' }, 'Server error'));
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  // Block sensitive files
  const first = urlPath.split('/').filter(Boolean)[0];
  if (first && BLOCKED.has(first)) {
    return send(res, 404, { 'Content-Type': 'text/plain' }, 'Not found');
  }

  let filePath = safeJoin(ROOT, urlPath);
  if (!filePath) return send(res, 403, { 'Content-Type': 'text/plain' }, 'Forbidden');

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) return serveFile(res, filePath);

    // Try appending .html (for clean URLs like /about)
    const htmlPath = filePath + '.html';
    fs.stat(htmlPath, (err2, stat2) => {
      if (!err2 && stat2.isFile()) return serveFile(res, htmlPath);

      // Fallback to index.html for root-like paths, otherwise 404
      fs.stat(path.join(ROOT, 'index.html'), (err3, stat3) => {
        if (!err3 && stat3.isFile()) {
          // Don't SPA-rewrite asset-like requests
          if (/\.[a-z0-9]+$/i.test(urlPath)) {
            return send(res, 404, { 'Content-Type': 'text/plain' }, 'Not found');
          }
          return serveFile(res, path.join(ROOT, 'index.html'));
        }
        send(res, 404, { 'Content-Type': 'text/plain' }, 'Not found');
      });
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Nuvexa static server listening on port ${PORT}`);
});
