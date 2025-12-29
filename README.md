# 中通快递智能报价系统

快速、智能的快递报价单生成系统

## 项目简介

中通快递金阊一部智能报价系统,用于替代传统Excel手工制作报价单的方式,实现3分钟内完成一份专业报价单。

## 技术栈

### 前端
- React 18 + TypeScript
- Ant Design 5
- Vite 5
- Zustand (状态管理)
- React Router 6

### 后端
- FastAPI (Python 3.11)
- SQLAlchemy 2.0
- PostgreSQL 15+
- Redis 7
- WeasyPrint (PDF导出)

### 部署
- Docker + Docker Compose
- Nginx (反向代理)

## 核心功能

- ✅ 智能报价单生成
- ✅ 价格编辑器 (单独修改、批量调整、省份定价)
- ✅ 三种价格模板 (通票/大客户/仓配)
- ✅ 多格式导出 (PDF/Excel/Word)
- ✅ 三种主题风格 (中通蓝/商务灰/清雅米)
- ✅ 条款管理系统
- ✅ 报价历史记录

## 快速开始

详见开发文档

## 项目配置

- **前端端口**: 1111
- **后端端口**: 8000
- **数据库**: PostgreSQL (192.168.50.178:5432)

## 开发计划

详见 `/home/toby/.claude/plans/polished-singing-nygaard.md`

## 许可证

专有软件 - 中通快递金阊一部
