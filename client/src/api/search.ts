import request from './request';

export function search(params: { q: string; type?: string; tag?: string; page?: number; pageSize?: number }) {
  return request.get('/search', { params });
}

export function getHotSearches() {
  return request.get('/search/hot');
}

export function getSearchHistory() {
  return request.get('/search/history');
}
