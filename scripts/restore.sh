#!/bin/bash
# 数据库恢复脚本

set -e

# 检查参数
if [ $# -eq 0 ]; then
    echo "用法: $0 <备份文件>"
    echo "示例: $0 backups/zto_quote_20250130_020000.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

# 检查备份文件是否存在
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "错误: 备份文件不存在: ${BACKUP_FILE}"
    exit 1
fi

# 确认操作
echo "警告: 此操作将覆盖当前数据库!"
echo "备份文件: ${BACKUP_FILE}"
read -p "确认继续? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo "操作已取消"
    exit 0
fi

# 执行恢复
echo "开始恢复数据库..."
gunzip < "${BACKUP_FILE}" | docker compose exec -T db psql -U zto_user zto_quote

echo "数据库恢复完成!"
