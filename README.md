# 项目概述

这是一个全栈应用程序，包含前端（Web）和后端（API）两部分。前端使用 React 技术栈构建，后端使用 Express.js 框架并集成 Prisma ORM 进行数据库操作。

## 目录结构

```
.
├── api/                    # 后端 API 服务
│   ├── generated/          # Prisma 生成的客户端代码
│   ├── prisma/             # Prisma 数据库配置和迁移文件
│   ├── src/                # 后端源代码
│   │   ├── app.js          # Express 应用主入口
│   │   ├── routes/         # API 路由定义
│   │   ├── middleware/     # Express 中间件
│   │   └── socket/         # Socket.IO 实时通信功能
│   ├── index.js            # 服务器启动文件
│   ├── package.json        # 后端依赖配置
│   └── prisma.config.js    # Prisma 配置文件
└── web/                    # 前端 React 应用
    ├── public/             # 静态资源文件
    ├── src/                # 前端源代码
    │   ├── components/     # 可复用组件
    │   ├── contexts/       # React 上下文管理
    │   ├── routes/         # 路由配置
    │   ├── pages/          # 页面组件
    │   ├── hooks/          # 自定义 React Hooks
    │   ├── services/       # API 服务调用
    │   ├── utils/          # 工具函数
    │   ├── styles/         # 样式文件
    │   └── main.jsx        # React 应用入口
    ├── index.html          # 主 HTML 文件
    ├── package.json        # 前端依赖配置
    ├── vite.config.js      # Vite 构建工具配置
    └── README.md           # 前端项目说明
```

## 文件作用说明

### API 目录

- `index.js`: 后端服务器的启动文件，创建 HTTP 服务器并初始化 Socket.IO。
- `package.json`: 定义后端项目的元数据和依赖项。
- `prisma.config.js`: Prisma ORM 的配置文件。
- `cleanup.sql`: 数据库清理脚本。
- `pnpm-workspace.yaml`: pnpm 工作区配置文件。
- `src/app.js`: Express 应用的主要配置文件，设置中间件和路由。
- `src/routes/router.js`: 定义所有 API 路由。
- `src/middleware/error.js`: 错误处理中间件。
- `src/socket/index.js`: Socket.IO 实时通信功能的初始化。

### Web 目录

- `src/main.jsx`: React 应用的入口点，设置上下文和路由。
- `package.json`: 定义前端项目的元数据和依赖项。
- `vite.config.js`: Vite 构建工具的配置文件。
- `index.html`: 应用的主 HTML 文件。
- `public/`: 存放静态资源，如图片、图标等。
- `src/components/`: 存放可复用的 UI 组件。
- `src/contexts/`: React Context API 的实现，用于状态管理。
- `src/routes/`: React Router 的路由配置。
- `src/pages/`: 应用的主要页面组件。
- `src/hooks/`: 自定义 React Hooks。
- `src/services/`: 与后端 API 交互的服务层。
- `src/utils/`: 通用工具函数。
- `src/styles/`: 全局样式和主题配置。
- `.env`: 环境变量配置文件。

## 技术栈

### 前端 (Web)
- **框架**: React 19.2.0
- **路由**: React Router DOM 7.12.0
- **构建工具**: Vite 7.2.4
- **UI 库**: TailwindCSS 4.1.18, Lucide React 0.562.0
- **状态管理**: React Context API
- **HTTP 客户端**: Axios 1.13.2
- **开发工具**: ESLint, Prettier
- **其他**: react-hot-toast, clsx

### 后端 (API)
- **框架**: Express.js 5.2.1
- **ORM**: Prisma 7.3.0
- **数据库适配器**: PostgreSQL (@prisma/adapter-pg)
- **数据库驱动**: pg 8.17.2
- **实时通信**: Socket.IO 4.8.3
- **安全**: Argon2 (密码哈希), JSON Web Token (认证)
- **开发工具**: pnpm 10.28.1

## 依赖项

### 前端依赖
- `react`: React 库
- `react-dom`: React DOM 渲染器
- `react-router-dom`: React 路由解决方案
- `axios`: HTTP 客户端
- `tailwindcss`: CSS 框架
- `lucide-react`: 图标库
- `react-hot-toast`: 提示通知组件
- `clsx`: 条件类名工具

### 后端依赖
- `express`: Web 应用框架
- `cors`: 跨域资源共享中间件
- `@prisma/client`: Prisma 客户端
- `pg`: PostgreSQL 客户端
- `socket.io`: 实时双向通信
- `jsonwebtoken`: JWT 认证
- `argon2`: 密码哈希算法
- `dotenv`: 环境变量加载

### 开发依赖
#### 前端
- `@vitejs/plugin-react`: React 插件
- `eslint`: JavaScript 代码检查工具
- `@types/react`: React 类型定义

#### 后端
- `prisma`: Prisma ORM 工具