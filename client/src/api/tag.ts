import request from './request';

export function getTags(limit = 50) {
  return request.get('/tags', { params: { limit } });
}

export function getTagResources(tagId: number, page = 1, pageSize = 20) {
  return request.get(`/tags/${tagId}/resources`, { params: { page, pageSize } });
}
