import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { getMe } from '@/api/user';

/**
 * Auth hook — loads user profile on mount and connects WebSocket.
 * Redirects to /login if token is invalid.
 */
export function useAuth() {
  const navigate = useNavigate();
  const { user, isLoggedIn, accessToken, setUser, logout } = useUserStore();
  const { connect, disconnect } = useNotificationStore();

  useEffect(() => {
    if (!isLoggedIn || !accessToken) return;

    // Load fresh user profile
    getMe()
      .then(({ data }) => {
        if (data.code === 0) {
          setUser(data.data);
        }
      })
      .catch(() => {
        logout();
        navigate('/login');
      });

    // Connect WebSocket
    connect(accessToken);

    return () => disconnect();
  }, [isLoggedIn, accessToken]);

  return { user, isLoggedIn };
}
