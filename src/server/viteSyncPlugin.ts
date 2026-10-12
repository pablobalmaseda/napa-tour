import type { Plugin, ViteDevServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import os from 'os';

function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const list = interfaces[name];
    if (!list) continue;
    for (const iface of list) {
      // Pick non-internal IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

export function presentationSyncPlugin(): Plugin {
  let wss: WebSocketServer | null = null;
  let currentSlideIndex = 0;

  return {
    name: 'presentation-sync-server',
    configureServer(server: ViteDevServer) {
      if (!server.httpServer) return;

      wss = new WebSocketServer({ noServer: true });

      server.httpServer.on('upgrade', (request, socket, head) => {
        const url = new URL(request.url || '', `http://${request.headers.host}`);
        if (url.pathname === '/sync-ws') {
          wss?.handleUpgrade(request, socket, head, (ws) => {
            wss?.emit('connection', ws, request);
          });
        }
      });

      const broadcastState = () => {
        if (!wss) return;
        const payload = JSON.stringify({
          type: 'SYNC_STATE',
          currentSlideIndex,
          clientsCount: wss.clients.size,
          timestamp: Date.now()
        });

        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        }
      };

      wss.on('connection', (ws) => {
        // Send initial state immediately
        ws.send(JSON.stringify({
          type: 'SYNC_STATE',
          currentSlideIndex,
          clientsCount: wss?.clients.size || 1,
          timestamp: Date.now()
        }));

        // Broadcast updated client count to everyone
        broadcastState();

        ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString());
            if (message.type === 'SET_SLIDE' && typeof message.index === 'number') {
              currentSlideIndex = message.index;
              broadcastState();
            } else if (message.type === 'GET_STATE') {
              ws.send(JSON.stringify({
                type: 'SYNC_STATE',
                currentSlideIndex,
                clientsCount: wss?.clients.size || 1,
                timestamp: Date.now()
              }));
            }
          } catch (err) {
            console.error('[Sync Server] Invalid message received:', err);
          }
        });

        ws.on('close', () => {
          broadcastState();
        });
      });

      // HTTP endpoint for pairing and local IP discovery
      server.middlewares.use('/api/remote-info', (req, res) => {
        if (req.method === 'GET') {
          const ip = getLocalIp();
          const port = server.config.server.port || 5173;
          const hostHeader = req.headers.host;
          // If request came from another device or host, use host if available, else detected LAN IP
          const url = `http://${ip}:${port}/remote`;

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            ip,
            port,
            remoteUrl: url,
            hostHeader
          }));
        }
      });

      // Serve /remote fallback to index.html for client-side routing
      server.middlewares.use((req, _res, next) => {
        if (req.url && (req.url === '/remote' || req.url.startsWith('/remote?'))) {
          req.url = '/index.html';
        }
        next();
      });
    }
  };
}
