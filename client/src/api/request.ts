import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/store/useUserStore';

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach access token
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useUserStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token refresh on 401
request.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useUserStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken });
          if (data.code === 0) {
            const { accessToken, refreshToken: newRefreshToken } = data.data;
            useUserStore.getState().setTokens(accessToken, newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return request(originalRequest);
          }
        } catch {
          // Refresh token also expired
          useUserStore.getState().logout();
          window.location.href = '/login';
        }
      } else {
        useUserStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default request;
