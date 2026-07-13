# 📚 DevVault — 开发者学习资源协作平台

一个程序员专用的收藏夹 + 笔记本 + 知识库 + 学习路线平台。支持链接自动解析、全文搜索、Chrome 插件一键收藏、学习路线规划与协作分享。

## 功能

- **链接智能解析** — 粘贴 URL 自动提取标题、封面、标签，支持 GitHub / B站 / 掘金等平台
- **多类型资源管理** — 文章、视频、代码片段、笔记、文档统一管理
- **标签系统** — 标签云、按标签筛选、自动标签建议
- **收藏夹** — 嵌套文件夹、资源分组、公开/私有设置
- **学习路线** — 创建学习路线、进度追踪、Fork 分享、公开广场
- **全文搜索** — MeiliSearch 驱动、模糊搜索、搜索热词
- **社交功能** — 关注用户、点赞、评论
- **实时通知** — WebSocket 推送
- **数据统计** — ECharts 可视化仪表盘（饼图、柱状图、热力图）
- **Chrome 插件** — 浏览器右键一键保存网页
- **暗色主题** — 亮色/暗色切换

## 技术栈

**前端：** React 18 / TypeScript / Ant Design 5 / Zustand / ECharts / @uiw/react-md-editor

**后端：** Node.js / Express / Prisma ORM / MySQL / Redis / MeiliSearch / WebSocket

**其他：** Docker / Nginx / GitHub Actions CI/CD / Chrome Extension

## 项目结构

```
devvault/
├── client/                 # 前端 React + TypeScript
│   └── src/
│       ├── api/            # API 请求封装
│       ├── components/     # 布局组件
│       ├── hooks/          # 自定义 hooks
│       ├── pages/          # 14 个页面
│       ├── store/          # Zustand 状态管理
│       └── styles/         # 全局样式
├── server/                 # 后端 Node.js + Express
│   └── src/
│       ├── config/         # 数据库/Redis/MeiliSearch 配置
│       ├── controllers/    # 控制器
│       ├── services/       # 业务逻辑
│       ├── parsers/        # URL 解析器（GitHub/B站/通用）
│       ├── middlewares/    # 鉴权/校验/限流
│       └── websocket/      # 实时通知
├── extension/              # Chrome 浏览器插件
├── docker/                 # Docker 配置
└── docs/                   # 文档（架构/API/部署）
```

## 快速开始

### 前置条件

- Node.js 20+
- MySQL 8.0+
- Redis（可选）
- MeiliSearch（可选）

### 1. 克隆项目

```bash
git clone https://github.com/BILSON093/devvault.git
cd devvault
```

### 2. 准备数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE devvault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入表结构（不含数据）
mysql -u root -p devvault < server/prisma/dumps/devvault.sql

# 或使用 Prisma 同步表结构（推荐）
cd server
npx prisma db push
```

### 3. 启动后端

```bash
cd server
cp .env.example .env        # 编辑 .env 配置数据库连接
npm install
npx prisma generate
npx prisma db push           # 同步表结构
npm run dev                  # 启动 http://localhost:3000
```

### 4. 启动前端

```bash
cd client
npm install
npm run dev                  # 启动 http://localhost:5173
```

### 5. 登录

- 访问 http://localhost:5173
- 账号：`demo@devvault.com` / `123456`

### 6. 安装 Chrome 插件（可选）

1. 打开 `chrome://extensions/`
2. 开启「开发者模式」
3. 点「加载已解压的扩展程序」
4. 选择 `extension/` 目录

## Docker 部署

```bash
cd docker
docker-compose up -d         # 启动 MySQL + Redis + MeiliSearch
cd ../server
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

## 初始化数据

项目提供 seed 脚本用于初始化基础数据：

```bash
cd server

# 基础 seed（demo 用户 + 标签）
npx tsx prisma/seed.ts

# AI 学习路线框架（标签 + 空路线/收藏夹）
npx tsx prisma/seed-ai-roadmap.ts
```

登录账号：`demo@devvault.com` / `123456`

## 文档

- [架构设计](docs/architecture.md)
- [API 文档](docs/api.md)
- [部署指南](docs/deploy.md)

## License

MIT
