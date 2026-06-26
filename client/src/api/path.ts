import request from './request';

export interface CreatePathParams {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export function createPath(data: CreatePathParams) {
  return request.post('/paths', data);
}

export function getPaths(page = 1, pageSize = 20) {
  return request.get('/paths', { params: { page, pageSize } });
}

export function getPathById(id: number) {
  return request.get(`/paths/${id}`);
}

export function updatePath(id: number, data: Partial<CreatePathParams>) {
  return request.put(`/paths/${id}`, data);
}

export function deletePath(id: number) {
  return request.delete(`/paths/${id}`);
}

export function addPathItem(pathId: number, resourceId: number, sortOrder?: number) {
  return request.post(`/paths/${pathId}/items`, { resourceId, sortOrder });
}

export function updatePathItem(pathId: number, itemId: number, data: { status?: string; sortOrder?: number; note?: string }) {
  return request.put(`/paths/${pathId}/items/${itemId}`, data);
}

export function removePathItem(pathId: number, itemId: number) {
  return request.delete(`/paths/${pathId}/items/${itemId}`);
}

export function forkPath(id: number) {
  return request.post(`/paths/${id}/fork`);
}

export function getExplore(page = 1, pageSize = 20, sort = 'newest') {
  return request.get('/paths/explore', { params: { page, pageSize, sort } });
}
