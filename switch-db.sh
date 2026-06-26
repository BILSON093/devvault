#!/bin/bash
# 切换数据库模式
# 用法: ./switch-db.sh sqlite  或  ./switch-db.sh mysql

MODE=${1:-sqlite}

if [ "$MODE" = "sqlite" ]; then
    cp server/.env.sqlite server/.env
    cp server/prisma/schema.sqlite.prisma server/prisma/schema.prisma 2>/dev/null || true
    echo "✅ 已切换到 SQLite 模式（不需要外部数据库）"
    echo "   运行: cd server && npx prisma generate && npx prisma db push"
elif [ "$MODE" = "mysql" ]; then
    cp server/.env.mysql server/.env
    cp server/prisma/schema.mysql.prisma server/prisma/schema.prisma 2>/dev/null || true
    echo "✅ 已切换到 MySQL 模式"
    echo "   确保 Docker 已启动: cd docker && docker-compose up -d"
    echo "   然后运行: cd server && npx prisma generate && npx prisma db push"
else
    echo "用法: ./switch-db.sh [sqlite|mysql]"
fi
