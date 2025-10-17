# 割草机行业分析网站

该项目旨在打造一个专注割草机/割草机器人行业研究的可视化平台，覆盖公司画像、产品矩阵、型号参数、横向对比与数据录入（CMS）。当前版本提供基于 Next.js + Tailwind CSS 的前端骨架、静态演示数据与组件设计示例，便于后续迭代为完整的全栈系统。

## ✨ 功能概览

- **公司目录**：以品牌卡片呈现行业玩家，覆盖 Stanley Black & Decker、Husqvarna、John Deere、Toro、AriensCo、Stiga、Swisher、Bobcat、Greenworks、MTD、TTI、Chervon、Scag、Wright、Mean Green、Stihl、Textron、Honda、Kubota、Bad Boy 等品牌矩阵。
- **公司详情**：展示多级树状产品结构（公司 → 品牌/事业部 → 品类 → 系列 → 型号），并与导入数据自动合并。
- **产品总览**：按用途/动力/割幅等筛选型号卡片，结合导入数据实时刷新，内置 24 款示例型号。
- **对比分析**：勾选型号进入对比栏，高亮差异、折叠相同项，覆盖机械/导航/软件/环境等分组字段。
- **CMS 入口**：提供 CSV / JSON 产品导入工具，使用 `pudu / pudu` 账号向 `/api/import` 写入数据。

> 当前实现基于静态示例数据，重点呈现信息架构与交互流程，后续可通过 Prisma + PostgreSQL/NestJS 等方案接入真实数据源。

## 🧱 技术栈

- **前端框架**：Next.js 14（App Router, TypeScript, Server Components）
- **样式体系**：Tailwind CSS + 自定义主题色板
- **状态管理**：Zustand（对比栏、筛选器示例）
- **UI 组件**：自定义滚动区域、lucide-react 图标

## 📁 目录结构

```
├── app
│   ├── (site)
│   │   ├── companies
│   │   │   └── [companyId]
│   │   ├── compare
│   │   ├── products
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── import
│   │   └── products
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
│   ├── server
│   │   ├── companies.ts
│   │   └── products.ts
│   └── utils.ts
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
2. **刷新示例数据（可选）**
   ```bash
   npm run refresh:data
   ```
   该命令会读取 `data/mock-products.ts` 并生成 `data/imported-products.json`，模拟“导入后写入数据库”的过程。

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
4. 打开浏览器访问 `http://localhost:3000` 即可查看示例站点。

## 📥 导入接口（演示）

- **接口地址**：`POST /api/import`
- **认证方式**：Basic Auth，默认 `pudu / pudu`
- **请求示例**：

  ```json
  {
    "products": [
      {
        "id": "demo-001",
        "modelName": "示例机器人",
        "companyId": "toro",
        "divisionId": "toro-hayter",
        "categoryId": "hayter-robotic",
        "seriesId": "hayter-oaspire",
        "marketPosition": "prosumer",
        "powertrain": "Robot",
        "summary": "演示数据",
        "specs": {
          "cutting_width": "55||cm",
          "runtime": "120 分钟",
          "navigation_obstacle": "激光雷达"
        }
      }
    ]
  }
  ```

- **CSV 规则**：字段名与 `specs-dictionary.ts` 中的 `key` 对应；如需附带单位可使用 `值||单位` 格式。

导入成功后，数据将写入 `data/imported-products.json`，同时影响产品目录、公司矩阵与对比页的展示。

## 📦 数据刷新脚本

- `npm run refresh:data`：从 `data/mock-products.ts` 提取 24 条示例型号写入 `data/imported-products.json`，便于快速搭建或重置演示数据库。
- 生成的 JSON 文件既可直接作为静态数据，也可作为后端导入真实数据库时的结构参考。

## 📦 后续计划

- 接入 Prisma ORM + PostgreSQL，实现公司/产品/参数的可持久化存储。
- 扩展 CMS 表单、版本管理与权限审计流程。
- 增强对比导出能力（CSV/PDF/PNG）与国际化（中英双语、单位换算）。

## 📝 许可证

MIT License
