import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  ws: WebSocket | null;

  setUnreadCount: (count: number) => void;
  connect: (token: string) => void;
  disconnect: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  ws: null,

  setUnreadCount: (count) => set({ unreadCount: count }),

  connect: (token) => {
    const existing = get().ws;
    if (existing?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws?token=${token}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          set((state) => ({ unreadCount: state.unreadCount + 1 }));
        }
      } catch {}
    };

    ws.onclose = () => {
      // Auto reconnect after 5s
      setTimeout(() => {
        if (get().ws === ws) {
          get().connect(token);
        }
      }, 5000);
    };

    set({ ws });
  },

  disconnect: () => {
    const ws = get().ws;
    if (ws) {
      ws.close();
      set({ ws: null, unreadCount: 0 });
    }
  },
}));
