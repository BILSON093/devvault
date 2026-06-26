export interface PaginationQuery {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ResourceType = 'article' | 'video' | 'repository' | 'snippet' | 'note' | 'documentation' | 'qa' | 'other';

export type PathItemStatus = 'not_started' | 'in_progress' | 'completed';

export type NotificationType = 'follow' | 'like' | 'comment' | 'fork' | 'system';
