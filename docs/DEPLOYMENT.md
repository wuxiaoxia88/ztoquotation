# 部署指南

本文档详细说明如何部署中通快递智能报价系统到生产环境。

## 📋 前置要求

### 服务器要求

- **操作系统**: Linux (推荐 Ubuntu 20.04+ 或 CentOS 7+)
- **CPU**: 2核及以上
- **内存**: 4GB及以上
- **磁盘**: 20GB及以上可用空间
- **网络**: 公网IP或域名

### 软件要求

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## 🚀 快速部署

### 1. 安装 Docker 和 Docker Compose

#### Ubuntu/Debian

```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl enable docker
sudo systemctl start docker
```

#### CentOS/RHEL

```bash
# 安装依赖
sudo yum install -y yum-utils

# 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. 克隆项目

```bash
# 克隆仓库
git clone https://github.com/wuxiaoxia88/ztoquotation.git
cd ztoquotation/zto-quote-system
```

### 3. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑环境变量
nano .env
```

**重要**: 请务必修改以下配置项:

```env
# 数据库密码 (必须修改)
DB_PASSWORD=your_strong_password_here

# JWT 密钥 (必须修改为随机字符串)
SECRET_KEY=your_secret_key_min_32_characters_long

# JWT 算法 (保持默认)
ALGORITHM=HS256

# Token 过期时间 (30天,可根据需要调整)
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

生成安全的 SECRET_KEY:

```bash
# 使用 openssl 生成随机密钥
openssl rand -hex 32
```

### 4. 启动服务

#### 开发/测试环境

```bash
# 构建并启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f

# 查看服务状态
docker compose ps
```

#### 生产环境

```bash
# 使用生产配置启动
docker compose -f docker-compose.prod.yml up -d

# 查看日志
docker compose -f docker-compose.prod.yml logs -f
```

### 5. 初始化数据库

数据库迁移会在后端服务启动时自动执行。

查看迁移状态:

```bash
# 进入后端容器
docker compose exec backend bash

# 查看当前迁移版本
alembic current

# 查看迁移历史
alembic history

# 退出容器
exit
```

### 6. 访问系统

服务启动成功后,通过以下地址访问:

- **前端应用**: http://your-server-ip
- **后端API**: http://your-server-ip:8002
- **API文档**: http://your-server-ip:8002/docs

默认管理员账号:
- 用户名: `admin`
- 密码: `admin123`

**重要**: 首次登录后请立即修改默认密码!

## 🔧 高级配置

### 配置 HTTPS (推荐)

#### 1. 使用 Let's Encrypt 免费证书

```bash
# 安装 certbot
sudo apt-get install -y certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com

# 证书将保存在
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem
```

#### 2. 配置 Nginx HTTPS

创建 `frontend/nginx-ssl.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location /api/ {
        proxy_pass http://backend:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

更新 `docker-compose.prod.yml` 挂载证书:

```yaml
frontend:
  volumes:
    - /etc/letsencrypt/live/your-domain.com:/etc/nginx/ssl:ro
```

### 配置域名

修改 `frontend/nginx.conf` 中的 `server_name`:

```nginx
server_name your-domain.com;
```

### 自定义端口

编辑 `docker-compose.yml` 或 `docker-compose.prod.yml`:

```yaml
frontend:
  ports:
    - "8080:80"  # 修改为你需要的端口
```

## 📊 监控和维护

### 查看服务状态

```bash
# 查看所有容器状态
docker compose ps

# 查看资源使用
docker stats

# 查看特定服务日志
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### 数据库备份

#### 手动备份

```bash
# 创建备份目录
mkdir -p ./backups

# 备份数据库
docker compose exec db pg_dump -U zto_user zto_quote | gzip > ./backups/zto_quote_$(date +%Y%m%d_%H%M%S).sql.gz
```

#### 自动备份脚本

创建 `scripts/backup.sh`:

```bash
#!/bin/bash
set -e

BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/zto_quote_$DATE.sql.gz"

# 创建备份
docker compose exec -T db pg_dump -U zto_user zto_quote | gzip > "$BACKUP_FILE"

# 只保留最近7天的备份
find "$BACKUP_DIR" -name "zto_quote_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

添加到 crontab (每天凌晨2点备份):

```bash
0 2 * * * /path/to/scripts/backup.sh >> /var/log/zto-backup.log 2>&1
```

#### 恢复数据库

```bash
# 从备份恢复
gunzip < ./backups/zto_quote_20250130_020000.sql.gz | docker compose exec -T db psql -U zto_user zto_quote
```

### 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker compose down
docker compose build --no-cache
docker compose up -d

# 或使用生产配置
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### 清理资源

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理未使用的卷
docker volume prune

# 清理未使用的网络
docker network prune

# 一次性清理所有未使用资源
docker system prune -a --volumes
```

## 🔒 安全建议

### 1. 修改默认密码

首次部署后立即修改:
- 管理员账号密码
- 数据库密码
- JWT 密钥

### 2. 配置防火墙

```bash
# Ubuntu (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. 限制数据库访问

默认配置中,PostgreSQL 只在内部网络中暴露。如需外部访问,请:

1. 使用 VPN 或 SSH 隧道
2. 配置强密码和 SSL 连接
3. 限制允许的IP地址

### 4. 启用 HTTPS

生产环境务必启用 HTTPS,参见上方 "配置 HTTPS" 章节。

### 5. 定期更新

```bash
# 更新系统包
sudo apt-get update && sudo apt-get upgrade -y

# 更新 Docker 镜像
docker compose pull
docker compose up -d
```

## 📈 性能优化

### 1. 后端优化

生产环境使用多进程:

```yaml
backend:
  command: uvicorn app.main:app --host 0.0.0.0 --port 8002 --workers 4
```

Worker 数量建议: `(CPU核心数 * 2) + 1`

### 2. 数据库优化

编辑 `docker-compose.yml`:

```yaml
db:
  command:
    - "postgres"
    - "-c"
    - "max_connections=200"
    - "-c"
    - "shared_buffers=256MB"
    - "-c"
    - "effective_cache_size=1GB"
    - "-c"
    - "work_mem=16MB"
```

### 3. 前端优化

- 已启用 Gzip 压缩
- 已配置静态资源缓存
- 使用 CDN (可选)

## 🐛 故障排查

### 服务无法启动

```bash
# 查看详细日志
docker compose logs

# 检查端口占用
sudo netstat -tulpn | grep -E ':(80|443|8002|5432)'

# 检查磁盘空间
df -h
```

### 数据库连接失败

```bash
# 检查数据库服务
docker compose ps db

# 测试数据库连接
docker compose exec db psql -U zto_user -d zto_quote

# 查看数据库日志
docker compose logs db
```

### 前端无法访问后端

检查 `frontend/nginx.conf` 中的 proxy_pass 配置是否正确。

### 容器内存不足

增加 Docker 资源限制,编辑 `/etc/docker/daemon.json`:

```json
{
  "default-ulimits": {
    "nofile": {
      "Hard": 64000,
      "Name": "nofile",
      "Soft": 64000
    }
  }
}
```

重启 Docker:

```bash
sudo systemctl restart docker
```

## 📞 技术支持

如遇到问题:

1. 查看 [常见问题](https://github.com/wuxiaoxia88/ztoquotation/wiki/FAQ)
2. 提交 [Issue](https://github.com/wuxiaoxia88/ztoquotation/issues)
3. 联系项目维护者

---

**部署完成后,请确保:**

- ✅ 修改了默认密码
- ✅ 配置了 HTTPS
- ✅ 设置了数据库备份
- ✅ 配置了防火墙
- ✅ 监控服务运行状态
