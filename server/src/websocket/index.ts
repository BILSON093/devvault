import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { verifyAccessToken } from '../utils/jwt';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: number;
}

const clients = new Map<number, Set<AuthenticatedWebSocket>>();

export function initWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
    // Extract token from query string
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (token) {
      try {
        const payload = verifyAccessToken(token);
        ws.userId = payload.userId;

        if (!clients.has(payload.userId)) {
          clients.set(payload.userId, new Set());
        }
        clients.get(payload.userId)!.add(ws);

        console.log(`WebSocket connected: user ${payload.userId}`);
      } catch {
        ws.close(4001, 'Invalid token');
        return;
      }
    }

    ws.on('close', () => {
      if (ws.userId) {
        const userClients = clients.get(ws.userId);
        if (userClients) {
          userClients.delete(ws);
          if (userClients.size === 0) clients.delete(ws.userId);
        }
      }
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message);
    });

    // Send ping every 30s to keep connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 30000);
  });

  console.log('✅ WebSocket server initialized');
  return wss;
}

/**
 * Send notification to a specific user
 */
export function sendToUser(userId: number, data: any) {
  const userClients = clients.get(userId);
  if (!userClients) return;

  const message = JSON.stringify(data);
  for (const ws of userClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
}

/**
 * Send notification to multiple users
 */
export function sendToUsers(userIds: number[], data: any) {
  for (const userId of userIds) {
    sendToUser(userId, data);
  }
}
