#!/bin/bash
# 数据库备份脚本

set -e

# 配置
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${PROJECT_DIR}/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/zto_quote_${DATE}.sql.gz"

# 创建备份目录
mkdir -p "${BACKUP_DIR}"

# 执行备份
echo "开始备份数据库..."
cd "${PROJECT_DIR}"

if docker compose ps | grep -q "zto-quote-db"; then
    docker compose exec -T db pg_dump -U zto_user zto_quote | gzip > "${BACKUP_FILE}"
    echo "备份完成: ${BACKUP_FILE}"
    
    # 显示文件大小
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "备份大小: ${BACKUP_SIZE}"
    
    # 只保留最近7天的备份
    find "${BACKUP_DIR}" -name "zto_quote_*.sql.gz" -mtime +7 -delete
    echo "已清理7天前的旧备份"
    
    # 显示剩余备份
    echo -e "\n现有备份文件:"
    ls -lh "${BACKUP_DIR}"
else
    echo "错误: 数据库容器未运行"
    exit 1
fi
