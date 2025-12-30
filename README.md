# 中通快递智能报价系统

一个基于 React + FastAPI 的现代化快递报价管理系统,支持多种报价模式、价格管理、条款定制和多格式导出。

## 📋 项目简介

中通快递智能报价系统是为中通快递量身定制的报价单管理工具,提供了完整的报价流程管理,从创建、编辑到导出的一站式解决方案。

### 核心功能

- ✅ **报价单管理** - 创建、查看、编辑、复制、删除报价单
- ✅ **智能价格编辑器** - 支持通票、大客户、仓配三种模式
- ✅ **模板系统** - 可保存和复用价格模板
- ✅ **条款管理** - 固定条款、可选条款、自定义条款
- ✅ **多格式导出** - HTML、Excel、PDF三种格式
- ✅ **用户权限** - 管理员和操作员两种角色

## 🚀 技术栈

### 前端
- **React 18** - 用户界面框架
- **TypeScript 5** - 类型安全
- **Vite 5** - 构建工具
- **Ant Design 5** - UI组件库
- **React Router 6** - 路由管理
- **Zustand 4** - 状态管理
- **Axios** - HTTP客户端

### 后端
- **FastAPI** - Python Web框架
- **SQLAlchemy 2.0** - ORM
- **PostgreSQL 18** - 数据库
- **Alembic** - 数据库迁移
- **JWT** - 身份认证
- **WeasyPrint** - PDF生成

## 📦 系统要求

### 开发环境
- Node.js >= 18
- Python >= 3.13
- PostgreSQL >= 18
- Git

### 生产环境
- Docker & Docker Compose (推荐)
- 或手动部署需要上述所有依赖

## 🛠️ 快速开始

### 1. 克隆项目

\`\`\`bash
git clone https://github.com/wuxiaoxia88/ztoquotation.git
cd ztoquotation/zto-quote-system
\`\`\`

### 2. 环境配置

#### 后端配置

\`\`\`bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\\Scripts\\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件,配置数据库连接
\`\`\`

\`.env\` 文件示例:
\`\`\`env
DATABASE_URL=postgresql://user:password@localhost:5432/zto_quote
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
\`\`\`

#### 前端配置

\`\`\`bash
cd frontend

# 安装依赖
npm install
\`\`\`

### 3. 启动服务

#### 启动后端

\`\`\`bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8002
\`\`\`

后端服务: http://localhost:8002
API文档: http://localhost:8002/docs

#### 启动前端

\`\`\`bash
cd frontend
npm run dev
\`\`\`

前端服务: http://localhost:1111

### 4. 登录系统

默认账号:
- 用户名: \`admin\`
- 密码: \`admin123\`

## 📱 功能说明

### 1. 报价单管理

#### 创建报价单 (6步向导)
1. **客户信息** - 填写客户名称、联系人、电话等
2. **选择模板** - 选择报价模板类型(通票/大客户/仓配)
3. **编辑价格** - 使用价格编辑器设置价格
4. **选择条款** - 选择固定条款、可选条款或添加自定义条款
5. **报价信息** - 选择报价人、设置日期和有效期
6. **预览保存** - 预览所有信息并保存

#### 价格编辑器

**通票模式:**
- 区域价格表格(6个区域)
- 省份单独定价(34个省份可覆盖区域价格)
- 批量调整(+/-10%、+/-1元)

**大客户模式:**
- 重量段价格表格(可动态增删)
- 自定义重量段范围
- 批量调整功能

### 2. 模板管理

- 创建/编辑价格模板
- 设置默认模板(同类型互斥)
- 模板分类管理(通票/大客户/仓配)

### 3. 导出功能

支持三种格式:
- **HTML** - 在线预览
- **Excel** - 数据表格
- **PDF** - 打印版本

## 🏗️ 项目结构

\`\`\`
zto-quote-system/
├── backend/                 # 后端项目
│   ├── alembic/            # 数据库迁移
│   ├── app/                # 应用代码
│   │   ├── api/           # API路由
│   │   ├── models/        # 数据模型
│   │   ├── schemas/       # Pydantic模型
│   │   ├── utils/         # 工具函数
│   │   └── main.py        # 应用入口
│   └── requirements.txt    # Python依赖
│
├── frontend/               # 前端项目
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API服务
│   │   ├── stores/        # 状态管理
│   │   ├── types/         # TypeScript类型
│   │   └── App.tsx        # 应用入口
│   └── package.json       # Node依赖
│
└── docs/                   # 文档
\`\`\`

## 📊 API文档

完整API文档: http://localhost:8002/docs

### 主要接口

- \`POST /api/v1/auth/login\` - 用户登录
- \`GET /api/v1/quotes\` - 获取报价单列表
- \`POST /api/v1/quotes\` - 创建报价单
- \`GET /api/v1/quotes/{id}\` - 获取报价单详情
- \`GET /api/v1/exports/quotes/{id}/export/excel\` - 导出Excel

## 📝 更新日志

### v1.0.0 (2025-12-30)

- ✅ 完整的报价单管理系统
- ✅ 6步向导创建流程
- ✅ 智能价格编辑器
- ✅ 模板系统
- ✅ 多格式导出
- ✅ 用户权限管理

## 🤝 贡献指南

欢迎贡献代码!

## 📄 许可证

MIT License

## 👥 联系方式

- 项目维护: [wuxiaoxia88](https://github.com/wuxiaoxia88)
- 问题反馈: [Issues](https://github.com/wuxiaoxia88/ztoquotation/issues)

---

**由 Claude Code 协助开发** 🤖
