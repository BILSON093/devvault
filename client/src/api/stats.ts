import request from './request';

export function getOverview() {
  return request.get('/stats/overview');
}

export function getTypeDistribution() {
  return request.get('/stats/type-distribution');
}

export function getTagRanking() {
  return request.get('/stats/tag-ranking');
}

export function getActivityHeatmap() {
  return request.get('/stats/activity-heatmap');
}
