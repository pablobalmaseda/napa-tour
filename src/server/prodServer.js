import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '5173', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, '../../dist');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const list = interfaces[name];
    if (!list) continue;
    for (const iface of list) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Shared presentation state
let currentSlideIndex = 0;
let activeTab = 'story';
let photoIndex = 0;
let isLightboxOpen = false;

const wss = new WebSocketServer({ noServer: true });

function broadcastState() {
  const payload = JSON.stringify({
    type: 'SYNC_STATE',
    currentSlideIndex,
    activeTab,
    photoIndex,
    isLightboxOpen,
    clientsCount: wss.clients.size,
    timestamp: Date.now()
  });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({
    type: 'SYNC_STATE',
    currentSlideIndex,
    activeTab,
    photoIndex,
    isLightboxOpen,
    clientsCount: wss.clients.size,
    timestamp: Date.now()
  }));

  broadcastState();

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'SET_SLIDE' && typeof message.index === 'number') {
        currentSlideIndex = message.index;
        activeTab = 'story';
        photoIndex = 0;
        isLightboxOpen = false;
        broadcastState();
      } else if (message.type === 'SET_TAB' && typeof message.tab === 'string') {
        activeTab = message.tab;
        broadcastState();
      } else if (message.type === 'SET_PHOTO') {
        if (typeof message.photoIndex === 'number') photoIndex = message.photoIndex;
        if (typeof message.isLightboxOpen === 'boolean') isLightboxOpen = message.isLightboxOpen;
        broadcastState();
      } else if (message.type === 'GET_STATE') {
        ws.send(JSON.stringify({
          type: 'SYNC_STATE',
          currentSlideIndex,
          activeTab,
          photoIndex,
          isLightboxOpen,
          clientsCount: wss.clients.size,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      console.error('[Sync Server] Invalid WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    broadcastState();
  });
});

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. API: Remote Info
  if (pathname === '/api/remote-info' && req.method === 'GET') {
    const ip = getLocalIp();
    const hostHeader = req.headers.host || `${ip}:${PORT}`;
    const remoteUrl = `http://${hostHeader.includes(':') ? hostHeader : `${hostHeader}:${PORT}`}/?view=remote`;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ip,
      port: PORT,
      remoteUrl,
      hostHeader
    }));
    return;
  }

  // 2. API: Sync State (HTTP fallback)
  if (pathname === '/api/sync-state') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const message = JSON.parse(body);
          if (message.type === 'SET_SLIDE' && typeof message.index === 'number') {
            currentSlideIndex = message.index;
            activeTab = 'story';
            photoIndex = 0;
            isLightboxOpen = false;
            broadcastState();
          } else if (message.type === 'SET_TAB' && typeof message.tab === 'string') {
            activeTab = message.tab;
            broadcastState();
          } else if (message.type === 'SET_PHOTO') {
            if (typeof message.photoIndex === 'number') photoIndex = message.photoIndex;
            if (typeof message.isLightboxOpen === 'boolean') isLightboxOpen = message.isLightboxOpen;
            broadcastState();
          } else if (message.type === 'SYNC_STATE') {
            if (typeof message.currentSlideIndex === 'number') currentSlideIndex = message.currentSlideIndex;
            if (typeof message.activeTab === 'string') activeTab = message.activeTab;
            if (typeof message.photoIndex === 'number') photoIndex = message.photoIndex;
            if (typeof message.isLightboxOpen === 'boolean') isLightboxOpen = message.isLightboxOpen;
            broadcastState();
          }
        } catch {
          // ignore invalid json
        }
        res.writeHead(200);
        res.end(JSON.stringify({
          type: 'SYNC_STATE',
          currentSlideIndex,
          activeTab,
          photoIndex,
          isLightboxOpen,
          clientsCount: wss.clients.size,
          timestamp: Date.now()
        }));
      });
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({
      type: 'SYNC_STATE',
      currentSlideIndex,
      activeTab,
      photoIndex,
      isLightboxOpen,
      clientsCount: wss.clients.size,
      timestamp: Date.now()
    }));
    return;
  }

  // 3. Static File Serving from dist/
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    // If file doesn't exist, fallback to dist/index.html (SPA routing for /remote, /admin, etc.)
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      });
      res.end(content);
    });
  });
});

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
  const parsedUrl = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
  if (parsedUrl.pathname === '/sync-ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, HOST, () => {
  const localIp = getLocalIp();
  console.log(`🍷 Napa Valley Wine Presentation Server running at:`);
  console.log(`   ➜ Local:   http://localhost:${PORT}/`);
  console.log(`   ➜ Network: http://${localIp}:${PORT}/`);
  console.log(`   ➜ Remote:  http://${localIp}:${PORT}/?view=remote`);
  console.log(`   ➜ Admin:   http://${localIp}:${PORT}/admin`);
});
