import request from './request';

export interface ParsedResult {
  title: string;
  description?: string;
  cover?: string;
  type: string;
  source?: string;
  suggestedTags: string[];
  content?: string;
  extra?: Record<string, any>;
}

export function parseUrl(url: string) {
  return request.post<{ code: number; data: ParsedResult }>('/parse/url', { url });
}
