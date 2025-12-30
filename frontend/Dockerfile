# 前端Docker镜像(多阶段构建)

# 阶段1: 构建
FROM node:20-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# 阶段2: 运行(使用nginx)
FROM nginx:1.24-alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 1111

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
