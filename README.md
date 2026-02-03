# demo，前端REACT，后端EXPRESS

## 特性

- 用户认证系统（JWT + Argon2）
- 实时通信（Socket.IO）
- 响应式用户界面
- 状态管理（React Context）
- 数据库操作（Prisma ORM）
- RESTful API 设计

## 技术栈

### 前端（Web）

- **框架**: React 19.2.0
- **路由**: React Router DOM 7.12.0
- **构建工具**: Vite 7.2.4
- **UI 库**: TailwindCSS 4.1.18, Lucide React 0.562.0
- **状态管理**: React Context API
- **HTTP 客户端**: Axios 1.13.2
- **实时通信**: Socket.IO Client 4.8.3

### 后端（API）

- **框架**: Express.js 5.2.1
- **ORM**: Prisma 7.3.0
- **数据库适配器**: PostgreSQL (@prisma/adapter-pg)
- **数据库驱动**: pg 8.17.2
- **实时通信**: Socket.IO 4.8.3
- **安全**: Argon2（密码哈希），JSON Web Token（认证）

## 目录结构介绍

```
.
├── api/                    # 后端 API 服务
│   ├── generated/          # Prisma 生成的客户端代码
│   ├── prisma/             # Prisma 数据库配置和迁移文件
│   ├── src/                # 后端源代码
│   │   ├── errors/         # 错误处理模块
│   │   ├── feature/        # 业务功能模块
│   │   ├── middleware/     # Express 中间件
│   │   ├── routes/         # API 路由定义
│   │   ├── socket/         # Socket.IO 实时通信功能
│   │   ├── utils/          # 工具函数
│   │   ├── app.js          # Express 应用主入口
│   │   └── db.js           # 数据库连接配置
│   ├── index.js            # 服务器启动文件
│   ├── package.json        # 后端依赖配置
│   └── prisma.config.js    # Prisma 配置文件
└── web/                    # 前端 React 应用
    ├── public/             # 静态资源文件
    ├── src/                # 前端源代码
    │   ├── api/            # API 接口调用
    │   ├── assets/         # 静态资源（图片、字体等）
    │   ├── components/     # 可复用组件
    │   ├── contexts/       # React 上下文管理
    │   ├── feature/        # 业务功能模块
    │   ├── hooks/          # 自定义 React Hooks
    │   ├── pages/          # 页面组件
    │   ├── routes/         # 路由配置
    │   ├── utils/          # 工具函数
    │   ├── App.jsx         # 应用根组件
    │   ├── index.css       # 全局样式
    │   ├── main.jsx        # React 应用入口
    │   └── socket.js       # Socket.IO 连接配置
    ├── index.html          # 主 HTML 文件
    ├── package.json        # 前端依赖配置
    ├── vite.config.js      # Vite 构建工具配置
    └── vercel.json         # Vercel 部署配置
```
