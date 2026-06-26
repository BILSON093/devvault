import { useEffect, useRef, useCallback } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useNotificationStore } from '@/store/useNotificationStore';

interface WebSocketMessage {
  type: string;
  data: any;
}

/**
 * WebSocket hook for real-time notifications.
 * Auto-connects on mount, auto-reconnects on disconnect.
 */
export function useWebSocket(onMessage?: (msg: WebSocketMessage) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const accessToken = useUserStore((s) => s.accessToken);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const connect = useCallback(() => {
    if (!accessToken) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws?token=${accessToken}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const msg: WebSocketMessage = JSON.parse(event.data);

        // Handle notification type
        if (msg.type === 'notification') {
          // Increment unread count
          const current = useNotificationStore.getState().unreadCount;
          setUnreadCount(current + 1);
        }

        onMessage?.(msg);
      } catch {}
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting in 5s...');
      setTimeout(connect, 5000);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    wsRef.current = ws;
  }, [accessToken, onMessage, setUnreadCount]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return wsRef;
}
