import request from './request';

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export function register(data: RegisterParams) {
  return request.post('/auth/register', data);
}

export function login(data: LoginParams) {
  return request.post('/auth/login', data);
}

export function getMe() {
  return request.get('/auth/me');
}

export function updateMe(data: { username?: string; bio?: string }) {
  return request.put('/auth/me', data);
}

export function getUserById(id: number) {
  return request.get(`/auth/${id}`);
}

export function followUser(id: number) {
  return request.post(`/auth/${id}/follow`);
}

export function unfollowUser(id: number) {
  return request.delete(`/auth/${id}/follow`);
}

export function getFollowers(id: number, page = 1, pageSize = 20) {
  return request.get(`/auth/${id}/followers`, { params: { page, pageSize } });
}

export function getFollowing(id: number, page = 1, pageSize = 20) {
  return request.get(`/auth/${id}/following`, { params: { page, pageSize } });
}
