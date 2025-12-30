#!/bin/bash
# 健康检查脚本

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${PROJECT_DIR}"

echo "=== 系统健康检查 ==="
echo ""

# 检查容器状态
echo "1. 检查容器状态"
CONTAINERS=$(docker compose ps -q)
if [ -z "$CONTAINERS" ]; then
    echo "   ❌ 没有运行的容器"
    exit 1
else
    echo "   ✅ 容器运行中"
    docker compose ps
fi

echo ""

# 检查后端健康
echo "2. 检查后端服务"
if curl -f -s http://localhost:8002/api/v1/health > /dev/null 2>&1; then
    echo "   ✅ 后端服务正常"
else
    echo "   ❌ 后端服务异常"
fi

echo ""

# 检查前端
echo "3. 检查前端服务"
if curl -f -s http://localhost/ > /dev/null 2>&1; then
    echo "   ✅ 前端服务正常"
else
    echo "   ❌ 前端服务异常"
fi

echo ""

# 检查数据库连接
echo "4. 检查数据库连接"
if docker compose exec -T db pg_isready -U zto_user -d zto_quote > /dev/null 2>&1; then
    echo "   ✅ 数据库连接正常"
else
    echo "   ❌ 数据库连接异常"
fi

echo ""

# 检查磁盘空间
echo "5. 检查磁盘空间"
DISK_USAGE=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo "   ✅ 磁盘空间充足 (已使用 ${DISK_USAGE}%)"
else
    echo "   ⚠️  磁盘空间不足 (已使用 ${DISK_USAGE}%)"
fi

echo ""

# 检查容器资源使用
echo "6. 容器资源使用"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "=== 健康检查完成 ==="
