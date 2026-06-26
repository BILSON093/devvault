# DevVault 架构设计文档

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  React SPA   │  │ Chrome 插件   │  │  WebSocket 客户端 │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼─────────────────┼────────────────────┼────────────┘
          │ HTTP            │ HTTP               │ WS
          ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      Nginx 反向代理                           │
│         /api/* → :3000    /ws → :3000/ws    / → 静态文件     │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Node.js + Express 后端                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ 路由层    │→│ 控制器    │→│ 服务层    │→│ 数据访问层     │  │
│  │ Routes   │ │Controller│ │ Service  │ │ Prisma ORM    │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────┬───────┘  │
│                                                  │          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │          │
│  │ 中间件    │ │ 解析器    │ │ WebSocket│        │          │
│  │ Auth     │ │ Parsers  │ │ 通知     │        │          │
│  │ Validate │ │ GitHub   │ │          │        │          │
│  │ RateLimit│ │ Bilibili │ │          │        │          │
│  │ Logger   │ │ Generic  │ │          │        │          │
│  └──────────┘ └──────────┘ └──────────┘        │          │
└────────────────────────────────────────────────┼───────────┘
          │                    │                 │
          ▼                    ▼                 ▼
   ┌────────────┐    ┌──────────────┐    ┌────────────┐
   │   Redis    │    │ MeiliSearch  │    │   MySQL    │
   │ 缓存/排行  │    │  全文搜索     │    │  主数据库   │
   └────────────┘    └──────────────┘    └────────────┘
```

## 技术选型理由

### 前端：React + TypeScript + Ant Design
- React 是国内招聘需求最大的前端框架
- TypeScript 提供类型安全，减少运行时错误
- Ant Design 企业级组件库，开箱即用
- Zustand 轻量状态管理，比 Redux 简单

### 后端：Node.js + Express + Prisma
- Node.js 与前端同语言，降低学习成本
- Express 轻量灵活，中间件生态丰富
- Prisma 现代 ORM，类型安全，迁移方便
- MySQL 国内最主流的关系型数据库

### 搜索：MeiliSearch
- 比 Elasticsearch 轻量，适合中小项目
- 开箱即用的中文分词
- RESTful API，易于集成

### 缓存：Redis
- 热门数据缓存，减轻数据库压力
- 搜索热词排行榜（Sorted Set）
- URL 解析结果缓存（24h 过期）
- Session 管理（未来扩展）

## 核心设计模式

### 1. 三层架构（Routes → Controllers → Services）
```
Routes:     定义 API 路径，挂载中间件
Controllers: 处理请求/响应，参数提取
Services:   业务逻辑，数据库操作
```
好处：职责清晰，易于测试和维护。

### 2. 策略模式（URL 解析器）
```
parseUrl(url)
  ├─ github.com  → parseGitHub()
  ├─ bilibili.com → parseBilibili()
  └─ 其他        → parseGeneric()
```
好处：新增平台只需添加一个 parser 文件，不需要修改核心逻辑。

### 3. 双 Token 鉴权
```
登录 → accessToken (15min) + refreshToken (7天)
请求 → Bearer accessToken
401  → 用 refreshToken 换新 accessToken
refreshToken 也过期 → 跳转登录页
```
好处：安全性高，用户体验好（不用频繁登录）。

### 4. 多级缓存
```
URL 解析缓存：
  L1: Redis (24h)
  L2: MySQL url_parse_cache 表 (7天)
  L3: 实时解析（最慢）

搜索热词：
  Redis Sorted Set (实时更新，持久化)
```

## 数据流示例

### 添加资源（带 URL 解析）
```
1. 用户粘贴 URL
2. 前端 800ms 防抖后调用 POST /api/parse/url
3. 后端查 Redis 缓存 → 命中则返回
4. 未命中 → 查 MySQL 缓存 → 命中则返回 + 回填 Redis
5. 未命中 → 根据 URL 模式分发到对应 parser
6. Parser 抓取/调用 API，提取结构化数据
7. 返回前端：标题、描述、封面、类型、建议标签
8. 前端自动填充表单
9. 用户确认后调用 POST /api/resources 创建资源
```

### 实时通知
```
1. 用户 A 点赞了用户 B 的资源
2. 后端创建 Notification 记录
3. 通过 WebSocket 推送给用户 B
4. 前端收到消息，更新通知铃铛数字
5. 用户 B 打开通知中心，查看通知详情
```

## 安全设计

| 措施 | 说明 |
|---|---|
| JWT 鉴权 | 双 token，access_token 短有效期 |
| bcrypt 密码加密 | 10 轮 salt |
| Rate Limiting | API 100次/15min，登录 10次/15min |
| Helmet | HTTP 安全头 |
| CORS | 限制允许的源 |
| 输入校验 | Zod schema 校验所有输入 |
| SQL 注入防护 | Prisma 参数化查询 |
| XSS 防护 | React 默认转义，DOMPurify 处理 Markdown |
