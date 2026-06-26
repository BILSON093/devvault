import request from './request';

export interface CreateCollectionParams {
  name: string;
  description?: string;
  isPublic?: boolean;
  parentId?: number;
}

export function createCollection(data: CreateCollectionParams) {
  return request.post('/collections', data);
}

export function getCollections(page = 1, pageSize = 20) {
  return request.get('/collections', { params: { page, pageSize } });
}

export function getCollectionById(id: number) {
  return request.get(`/collections/${id}`);
}

export function updateCollection(id: number, data: Partial<CreateCollectionParams>) {
  return request.put(`/collections/${id}`, data);
}

export function deleteCollection(id: number) {
  return request.delete(`/collections/${id}`);
}

export function addResourceToCollection(collectionId: number, resourceId: number) {
  return request.post(`/collections/${collectionId}/resources`, { resourceId });
}

export function removeResourceFromCollection(collectionId: number, resourceId: number) {
  return request.delete(`/collections/${collectionId}/resources/${resourceId}`);
}

export function forkCollection(id: number) {
  return request.post(`/collections/${id}/fork`);
}
