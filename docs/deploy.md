# DevVault 部署指南

## 方案一：本地 Docker 部署（推荐新手）

### 前置条件
- Docker Desktop 已安装并启动
- Git 已安装

### 步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-username/devvault.git
cd devvault

# 2. 复制环境变量
cp server/.env.example server/.env
# 编辑 server/.env，修改 JWT_SECRET 等敏感信息

# 3. 启动所有服务
cd docker
docker-compose up -d

# 4. 初始化数据库
docker exec -it devvault-server npx prisma db push
docker exec -it devvault-server npx prisma db seed

# 5. 访问
# 前端：http://localhost
# 后端 API：http://localhost/api
```

---

## 方案二：云服务器部署

### 推荐配置
- 阿里云/腾讯云学生机（2核4G 足够）
- Ubuntu 22.04 LTS
- 域名（可选）

### 步骤

#### 1. 服务器准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo apt install docker-compose-plugin -y

# 验证
docker --version
docker compose version
```

#### 2. 部署项目
```bash
# 克隆代码
git clone https://github.com/your-username/devvault.git
cd devvault

# 修改环境变量
cp server/.env.example server/.env
nano server/.env
# 修改以下内容：
# JWT_ACCESS_SECRET=你的安全密钥
# JWT_REFRESH_SECRET=你的安全密钥
# DATABASE_URL=mysql://root:你的密码@mysql:3306/devvault
# CORS_ORIGIN=http://你的域名

# 启动
cd docker
docker compose -f docker-compose.yml up -d --build
```

#### 3. 配置域名和 HTTPS（可选）
```bash
# 安装 Certbot
sudo apt install certbot -y

# 申请证书
sudo certbot certonly --standalone -d your-domain.com

# 将证书路径添加到 nginx.conf
# ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

#### 4. 设置自动更新
```bash
# 创建更新脚本
cat > /home/user/update.sh << 'EOF'
#!/bin/bash
cd /home/user/devvault
git pull
cd docker
docker compose up -d --build
EOF
chmod +x /home/user/update.sh

# 添加定时任务（每天凌晨3点检查更新）
crontab -e
# 0 3 * * * /home/user/update.sh >> /var/log/devvault-update.log 2>&1
```

---

## 方案三：免费部署（零成本）

适合展示和面试演示：

### 前端 → Vercel（免费）
1. 注册 Vercel 账号
2. 导入 GitHub 仓库
3. 设置：
   - Framework: Vite
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: dist
4. 环境变量：`VITE_API_URL=https://你的后端地址`

### 后端 → Railway（免费额度）
1. 注册 Railway 账号
2. 创建项目，添加 MySQL 和 Redis 服务
3. 部署 server 目录
4. 设置环境变量

### 搜索 → MeiliSearch Cloud（免费额度）
1. 注册 MeiliSearch Cloud
2. 获取 URL 和 API Key
3. 添加到后端环境变量

---

## 常见问题

### Q: 端口被占用怎么办？
```bash
# 查看占用端口的进程
netstat -tulpn | grep :3306
# 杀掉进程
kill -9 <PID>
# 或修改 docker-compose.yml 的端口映射
```

### Q: 数据库连接失败？
```bash
# 检查 MySQL 是否启动
docker ps | grep mysql
# 查看日志
docker logs devvault-mysql
# 确认 .env 中的 DATABASE_URL 正确
```

### Q: 如何备份数据库？
```bash
# 导出
docker exec devvault-mysql mysqldump -u root -pdevvault123 devvault > backup.sql

# 导入
docker exec -i devvault-mysql mysql -u root -pdevvault123 devvault < backup.sql
```

### Q: 如何查看日志？
```bash
# 所有服务日志
docker compose logs -f

# 指定服务日志
docker compose logs -f server
docker compose logs -f mysql
```
