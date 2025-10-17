# 割草机行业分析网站

该项目旨在打造一个专注割草机/割草机器人行业研究的可视化平台，覆盖公司画像、产品矩阵、型号参数、横向对比与数据录入（CMS）。当前版本提供基于 Next.js + Tailwind CSS 的前端骨架、静态演示数据与组件设计示例，便于后续迭代为完整的全栈系统。

## ✨ 功能概览

- **公司目录**：以品牌卡片呈现行业玩家，支持标签与搜索。
- **公司详情**：展示树状产品矩阵、关键指标与代表型号。
- **产品总览**：按用途/动力等筛选维度展示型号卡片。
- **对比分析**：勾选型号进入对比栏，高亮差异、折叠相同项。
- **CMS 入口**：规划内容模型、导入流程与版本管理的操作面板。

> 当前实现基于静态示例数据，重点呈现信息架构与交互流程，后续可通过 Prisma + PostgreSQL/NestJS 等方案接入真实数据源。

## 🧱 技术栈

- **前端框架**：Next.js 14（App Router, TypeScript, Server Components）
- **样式体系**：Tailwind CSS + 自定义主题色板
- **状态管理**：Zustand（对比栏、筛选器示例）
- **UI 组件**：Radix UI（滚动区域）、lucide-react 图标

## 📁 目录结构

```
├── app
│   ├── (site)
│   │   ├── companies
│   │   │   └── [companyId]
│   │   ├── compare
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── cms
│   │   ├── import
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── globals.css
├── components
│   ├── analytics
│   ├── compare
│   ├── layout
│   ├── navigation
│   ├── products
│   └── ui
├── data
│   ├── mock-companies.ts
│   ├── mock-products.ts
│   └── specs-dictionary.ts
├── lib
│   ├── filters.ts
│   └── format.ts
├── public
│   └── logos
└── types
    └── domain.ts
```

## 🚀 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```
2. **启动开发服务器**
   ```bash
   npm run dev
   ```
3. 打开浏览器访问 `http://localhost:3000` 即可查看示例站点。

## 📦 后续计划

- 接入 Prisma ORM + PostgreSQL，实现公司/产品/参数的可持久化存储。
- 构建 CMS 端数据录入表单、批量导入流程与版本管理。
- 增强对比导出能力（CSV/PDF/PNG）与国际化（中英双语、单位换算）。
- 集成鉴权与权限（Admin/Editor/Viewer）、审计日志。

## 📝 许可证

MIT License
