#!/bin/bash
# 部署/更新脚本

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${PROJECT_DIR}"

echo "=== 中通快递智能报价系统 部署脚本 ==="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装,请先安装 Docker"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "错误: Docker Compose 未安装,请先安装 Docker Compose"
    exit 1
fi

# 选择环境
echo "请选择部署环境:"
echo "1) 开发/测试环境 (docker-compose.yml)"
echo "2) 生产环境 (docker-compose.prod.yml)"
read -p "请输入选项 [1-2]: " ENV_CHOICE

case $ENV_CHOICE in
    1)
        COMPOSE_FILE="docker-compose.yml"
        ENV_NAME="开发/测试"
        ;;
    2)
        COMPOSE_FILE="docker-compose.prod.yml"
        ENV_NAME="生产"
        ;;
    *)
        echo "无效选项"
        exit 1
        ;;
esac

echo ""
echo "部署环境: ${ENV_NAME}"
echo "配置文件: ${COMPOSE_FILE}"
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "警告: .env 文件不存在,将从 .env.example 复制"
    cp .env.example .env
    echo "请编辑 .env 文件配置必要的环境变量"
    read -p "按任意键继续..."
fi

# 拉取最新代码 (可选)
read -p "是否拉取最新代码? (y/n): " PULL_CODE
if [ "${PULL_CODE}" = "y" ]; then
    echo "拉取最新代码..."
    git pull origin main
fi

# 停止现有服务
echo "停止现有服务..."
docker compose -f "${COMPOSE_FILE}" down

# 构建镜像
echo "构建 Docker 镜像..."
docker compose -f "${COMPOSE_FILE}" build --no-cache

# 启动服务
echo "启动服务..."
docker compose -f "${COMPOSE_FILE}" up -d

# 等待服务启动
echo "等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "=== 服务状态 ==="
docker compose -f "${COMPOSE_FILE}" ps

echo ""
echo "=== 部署完成 ==="
echo ""
echo "访问地址:"
echo "  前端: http://localhost (或您的服务器IP)"
echo "  后端API: http://localhost:8002"
echo "  API文档: http://localhost:8002/docs"
echo ""
echo "默认管理员账号:"
echo "  用户名: admin"
echo "  密码: admin123"
echo ""
echo "查看日志: docker compose -f ${COMPOSE_FILE} logs -f"
echo "停止服务: docker compose -f ${COMPOSE_FILE} down"
