import http from 'http';
import app from './app';
import { env } from './config/env';
import { initWebSocket } from './websocket';

async function bootstrap() {
  // Create HTTP server
  const server = http.createServer(app);

  // Initialize WebSocket
  initWebSocket(server);

  // Start server
  server.listen(env.PORT, () => {
    console.log(`
🚀 DevVault Server running!
   Port: ${env.PORT}
   Env:  ${env.NODE_ENV}
   URL:  http://localhost:${env.PORT}

   Note: Redis and MeiliSearch are optional.
   The app works without them (caching/search disabled).
    `);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down...');
    server.close(() => process.exit(0));
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
