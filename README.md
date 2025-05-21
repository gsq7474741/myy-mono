# MYY 项目 Monorepo

这是一个使用 pnpm workspaces 和 Turborepo 管理的 monorepo 项目，包含了小程序前端、管理后台系统前端和后端服务。

## 项目结构

```
myy-mono/
├── apps/
│   ├── myy-app/         # 小程序前端
│   ├── myy-backend/     # 后端服务
│   └── myy-dashboard/   # 管理后台系统前端
├── packages/            # 共享组件和库
├── .github/             # GitHub 工作流配置
├── pnpm-workspace.yaml  # pnpm 工作区配置
└── turbo.json           # Turborepo 配置
```

## 技术栈

### 小程序前端 (myy-app)

- TypeScript
- Taro (跨端框架)
- Vue 3 (UI 框架)
- Pinia (状态管理)
- UnoCss (原子化 CSS)

### 管理后台系统前端 (myy-dashboard)

- TypeScript
- Next.js (React 框架)
- Shadcn/UI (组件库)
- Tailwind CSS (样式)

### 后端服务 (myy-backend)

- TypeScript
- Node.js
- Hono (Web 框架)
- TypeORM (数据库 ORM)

## 开发环境设置

### 前提条件

- Node.js 20.x 或更高版本
- pnpm 10.x 或更高版本

### 安装依赖

```bash
# 安装所有工作区的依赖
pnpm install
```

### 开发命令

```bash
# 启动所有项目的开发服务器
pnpm dev

# 启动特定项目的开发服务器
pnpm --filter myy-app dev
pnpm --filter myy-backend dev
pnpm --filter myy-dashboard dev

# 构建所有项目
pnpm build

# 构建特定项目
pnpm --filter myy-app build
```

## 项目详情

### 小程序前端 (myy-app)

小程序前端使用 Taro + Vue3 + Pinia + UnoCss 技术栈开发，支持编译为微信小程序。

```bash
# 开发微信小程序
cd apps/myy-app
pnpm dev:weapp

# 构建 H5 版本
pnpm build:h5
```

### 后端服务 (myy-backend)

后端服务使用 TypeScript + Hono + TypeORM 技术栈，提供 RESTful API。

```bash
# 启动开发服务器
cd apps/myy-backend
pnpm dev

# 服务将在 http://localhost:3090 上运行
```

### 管理后台系统前端 (myy-dashboard)

管理后台使用 Next.js + Shadcn/UI 开发，提供管理界面。

```bash
# 启动开发服务器
cd apps/myy-dashboard
pnpm dev

# 服务将在 http://localhost:3000 上运行
```

## 部署

### 小程序前端 (myy-app)

小程序前端使用 GitHub Actions 进行 CI/CD，配置文件位于 `.github/workflows/` 目录下。

- 当 PR 提交到 develop 分支时，会自动部署预发布版本到阿里云 OSS
- 当代码合并到 develop 分支时，会自动部署生产版本到阿里云 OSS

### 后端服务 (myy-backend)

后端服务使用阿里云函数计算（FC）进行部署，在阿里云控制台查看部署配置


## 环境变量

各个项目的环境变量配置：

- `myy-app`: 在 `.env` 文件中配置
- `myy-backend`: 在 `.env.dev` 和 `.env.prod` 文件中配置
- `myy-dashboard`: 在 `.env.local` 文件中配置

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 许可证

本项目是专有软件，版权所有 (c) 2025 MYY项目团队。保留所有权利。

本项目使用了多个开源组件，这些组件大部分采用 MIT 许可证。有关详细信息，请参阅 [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md) 文件。

### 许可证检查

项目提供了一个许可证检查脚本，用于递归扫描 monorepo 中所有子项目的依赖许可证，并生成详细报告：

```bash
# 运行许可证检查脚本
node scripts/check-licenses.js
```

该脚本会：
1. 检查根目录和所有子项目的许可证
2. 生成详细的 Markdown 报告，保存到 `THIRD_PARTY_LICENSES.md`
3. 生成完整的 JSON 格式许可证信息，保存到 `licenses-full.json`
