import request from './request';

export function getNotifications(page = 1, pageSize = 20) {
  return request.get('/notifications', { params: { page, pageSize } });
}

export function markAllRead() {
  return request.put('/notifications/read-all');
}

export function markRead(id: number) {
  return request.put(`/notifications/${id}/read`);
}
