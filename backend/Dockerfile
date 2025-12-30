# 后端Docker镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖(WeasyPrint需要)
RUN apt-get update && apt-get install -y \
    gcc \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8002

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002", "--reload"]
