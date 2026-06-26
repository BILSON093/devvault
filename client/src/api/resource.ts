import request from './request';

export interface CreateResourceParams {
  title: string;
  url?: string;
  description?: string;
  content?: string;
  coverUrl?: string;
  type?: string;
  language?: string;
  source?: string;
  isPublic?: boolean;
  tagIds?: number[];
}

export interface ResourceListParams {
  page?: number;
  pageSize?: number;
  type?: string;
  tag?: string;
  keyword?: string;
  userId?: number;
}

export function createResource(data: CreateResourceParams) {
  return request.post('/resources', data);
}

export function getResources(params: ResourceListParams = {}) {
  return request.get('/resources', { params });
}

export function getResourceById(id: number) {
  return request.get(`/resources/${id}`);
}

export function updateResource(id: number, data: Partial<CreateResourceParams>) {
  return request.put(`/resources/${id}`, data);
}

export function deleteResource(id: number) {
  return request.delete(`/resources/${id}`);
}

export function likeResource(id: number) {
  return request.post(`/resources/${id}/like`);
}

export function unlikeResource(id: number) {
  return request.delete(`/resources/${id}/like`);
}

export function getComments(resourceId: number, page = 1, pageSize = 20) {
  return request.get(`/resources/${resourceId}/comments`, { params: { page, pageSize } });
}

export function createComment(resourceId: number, content: string, parentId?: number) {
  return request.post(`/resources/${resourceId}/comments`, { content, parentId });
}
