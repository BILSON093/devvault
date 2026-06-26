# DevVault API 文档

Base URL: `http://localhost:3000/api`

所有需要认证的接口需在 Header 中携带：
```
Authorization: Bearer <access_token>
```

## 统一响应格式

```json
{
  "code": 0,       // 0=成功, 非0=失败
  "message": "ok",
  "data": { ... }
}
```

---

## 认证模块 `/auth`

### 注册
```
POST /auth/register
Body: { username, email, password }
Response: { user, accessToken, refreshToken }
```

### 登录
```
POST /auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken }
```

### 刷新 Token
```
POST /auth/refresh
Body: { refreshToken }
Response: { accessToken, refreshToken }
```

### 获取当前用户 [需认证]
```
GET /auth/me
Response: { id, username, email, avatar, bio, _count }
```

### 更新个人信息 [需认证]
```
PUT /auth/me
Body: { username?, bio? }
Response: user object
```

### 获取用户公开主页
```
GET /auth/:id
Response: { id, username, avatar, bio, _count }
```

### 关注 [需认证]
```
POST /auth/:id/follow
```

### 取消关注 [需认证]
```
DELETE /auth/:id/follow
```

### 粉丝列表
```
GET /auth/:id/followers?page=1&pageSize=20
Response: { list, total, page, pageSize, totalPages }
```

### 关注列表
```
GET /auth/:id/following?page=1&pageSize=20
Response: { list, total, page, pageSize, totalPages }
```

---

## 资源模块 `/resources`

### 创建资源 [需认证]
```
POST /resources
Body: { title, url?, description?, content?, coverUrl?, type?, language?, source?, isPublic?, tagIds? }
Response: resource object
```

### 获取资源列表 [可选认证]
```
GET /resources?page=1&pageSize=20&type=&tag=&keyword=&userId=
Response: { list, total, page, pageSize, totalPages }
```
认证用户可看到自己的私有资源，未认证只能看到公开资源。

### 获取资源详情 [可选认证]
```
GET /resources/:id
Response: { ..., isLiked, user, tags, _count }
```

### 更新资源 [需认证]
```
PUT /resources/:id
Body: partial resource fields + tagIds?
Response: resource object
```

### 删除资源 [需认证]
```
DELETE /resources/:id
```

### 点赞 [需认证]
```
POST /resources/:id/like
```

### 取消点赞 [需认证]
```
DELETE /resources/:id/like
```

### 获取评论
```
GET /resources/:id/comments?page=1&pageSize=20
Response: { list, total, page, pageSize, totalPages }
```

### 发表评论 [需认证]
```
POST /resources/:id/comments
Body: { content, parentId? }
Response: comment object
```

---

## 收藏夹模块 `/collections`

### 创建收藏夹 [需认证]
```
POST /collections
Body: { name, description?, isPublic?, parentId? }
```

### 我的收藏夹列表 [需认证]
```
GET /collections?page=1&pageSize=20
```

### 收藏夹详情 [可选认证]
```
GET /collections/:id
```

### 更新收藏夹 [需认证]
```
PUT /collections/:id
Body: partial fields
```

### 删除收藏夹 [需认证]
```
DELETE /collections/:id
```

### 添加资源到收藏夹 [需认证]
```
POST /collections/:id/resources
Body: { resourceId }
```

### 从收藏夹移除资源 [需认证]
```
DELETE /collections/:id/resources/:resourceId
```

### Fork 收藏夹 [需认证]
```
POST /collections/:id/fork
```

---

## 学习路线模块 `/paths`

### 创建路线 [需认证]
```
POST /paths
Body: { title, description?, isPublic? }
```

### 我的路线列表 [需认证]
```
GET /paths?page=1&pageSize=20
```

### 路线详情 [可选认证]
```
GET /paths/:id
Response: { ..., progress: { total, completed, percentage }, items }
```

### 更新路线 [需认证]
```
PUT /paths/:id
```

### 删除路线 [需认证]
```
DELETE /paths/:id
```

### 添加资源到路线 [需认证]
```
POST /paths/:id/items
Body: { resourceId, sortOrder? }
```

### 更新路线资源状态 [需认证]
```
PUT /paths/:id/items/:itemId
Body: { status?, sortOrder?, note? }
status: not_started | in_progress | completed
```

### 从路线移除资源 [需认证]
```
DELETE /paths/:id/items/:itemId
```

### Fork 路线 [需认证]
```
POST /paths/:id/fork
```

### 公开路线广场
```
GET /paths/explore?page=1&pageSize=20&sort=newest|popular
```

---

## URL 解析模块 `/parse`

### 解析 URL [需认证]
```
POST /parse/url
Body: { url }
Response: {
  title, description?, cover?, type, source?,
  suggestedTags[], content?, extra?
}
```

支持的平台：
- GitHub 仓库 → 仓库名、Star 数、语言、README
- GitHub Gist → 代码内容、语言
- B站视频 → 标题、封面、UP主、播放量
- 掘金/CSDN/博客园/StackOverflow → 文章标题、正文
- 通用网页 → og 元数据 + Readability 正文提取

---

## 搜索模块 `/search`

### 全文搜索 [需认证]
```
GET /search?q=xxx&type=&tag=&page=1&pageSize=20
```

### 热门搜索
```
GET /search/hot
Response: [{ keyword, count }]
```

### 搜索历史 [需认证]
```
GET /search/history
Response: [{ keyword, createdAt }]
```

---

## 标签模块 `/tags`

### 获取标签列表（标签云）
```
GET /tags?limit=50
Response: [{ id, name, color, usageCount }]
```

### 获取标签下的资源
```
GET /tags/:id/resources?page=1&pageSize=20
```

---

## 通知模块 `/notifications`

### 通知列表 [需认证]
```
GET /notifications?page=1&pageSize=20
Response: { list, total, unreadCount, page, pageSize, totalPages }
```

### 全部已读 [需认证]
```
PUT /notifications/read-all
```

### 单条已读 [需认证]
```
PUT /notifications/:id/read
```

---

## 统计模块 `/stats`

### 总览数据 [需认证]
```
GET /stats/overview
Response: { totalResources, totalCollections, totalPaths, totalLikes, weeklyResources, monthlyResources }
```

### 资源类型分布 [需认证]
```
GET /stats/type-distribution
Response: [{ type, label, count }]
```

### 标签使用排行 [需认证]
```
GET /stats/tag-ranking
Response: [{ tagId, name, color, count }]
```

### 活跃度热力图 [需认证]
```
GET /stats/activity-heatmap
Response: [[date, count], ...]  // 最近 365 天
```

---

## WebSocket

连接地址：`ws://localhost:3000/ws?token=<access_token>`

服务端推送消息格式：
```json
{
  "type": "notification",
  "data": {
    "notificationType": "follow|like|comment|fork",
    "message": "xxx 关注了你",
    "senderId": 123,
    "createdAt": "2026-06-26T..."
  }
}
```

---

## 错误码

| code | 说明 |
|---|---|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或 token 过期 |
| 403 | 没有权限 |
| 404 | 资源不存在 |
| 409 | 数据冲突（重复创建） |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
