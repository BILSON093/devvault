import { z } from 'zod';

// User schemas
export const registerSchema = z.object({
  username: z.string().min(2, '用户名至少2个字符').max(50, '用户名最多50个字符'),
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6个字符').max(100, '密码最多100个字符'),
});

export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码'),
});

export const updateProfileSchema = z.object({
  username: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
});

// Resource schemas
export const createResourceSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200),
  url: z.string().url('URL格式不正确').optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  content: z.string().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  type: z.enum(['article', 'video', 'repository', 'snippet', 'note', 'documentation', 'qa', 'other']).optional(),
  language: z.string().max(50).optional().nullable(),
  source: z.string().max(50).optional().nullable(),
  isPublic: z.boolean().optional(),
  tagIds: z.array(z.number()).optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

// Collection schemas
export const createCollectionSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(100),
  description: z.string().max(500).optional().nullable(),
  isPublic: z.boolean().optional(),
  parentId: z.number().optional().nullable(),
});

export const updateCollectionSchema = createCollectionSchema.partial();

// Learning path schemas
export const createPathSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200),
  description: z.string().max(1000).optional().nullable(),
  isPublic: z.boolean().optional(),
});

export const updatePathSchema = createPathSchema.partial();

export const addPathItemSchema = z.object({
  resourceId: z.number(),
  sortOrder: z.number().optional(),
});

export const updatePathItemSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  sortOrder: z.number().optional(),
  note: z.string().max(500).optional().nullable(),
});

// URL parse schema
export const parseUrlSchema = z.object({
  url: z.string().url('URL格式不正确'),
});

// Comment schema
export const createCommentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空').max(2000),
  parentId: z.number().optional().nullable(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
