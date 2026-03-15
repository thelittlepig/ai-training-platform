# AI 培训平台

面向企业内部员工与外部学员的混合制 AI 培训平台，支持课程发布、资源管理、学员报名和审批制访问。

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **后端**: Node.js + Express + PostgreSQL
- **认证**: JWT
- **测试**: Jest + Playwright

## 功能特性

- 用户注册与审批制激活
- 课程发布与管理（支持章节）
- 资源库（文件上传与下载）
- 课程报名审批流程
- 角色权限管理（Admin / Instructor / Learner）
- 管理后台

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置数据库连接：

```bash
cp .env.example .env
```

### 3. 运行数据库迁移

```bash
npm run db:migrate
```

### 4. 启动开发服务器

```bash
# 启动后端
npm run dev:backend

# 启动前端（新终端）
npm run dev:frontend
```

### 5. 运行测试

```bash
npm test
```

## 项目结构

```
project/
├── src/
│   ├── backend/          # 后端代码
│   │   ├── routes/       # 路由定义
│   │   ├── controllers/  # 控制器
│   │   ├── models/       # 数据模型
│   │   └── middleware/   # 中间件
│   ├── frontend/         # 前端代码
│   │   ├── pages/        # 页面组件
│   │   ├── components/   # 通用组件
│   │   ├── hooks/        # 自定义 hooks
│   │   └── utils/        # 工具函数
│   └── shared/           # 前后端共享代码
├── migrations/           # 数据库迁移
├── tests/                # 测试文件
└── docs/                 # 文档
```

## API 文档

所有 API 路由前缀为 `/api`，统一响应格式：

```json
{
  "code": 200,
  "message": "OK",
  "data": {}
}
```

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 课程相关

- `GET /api/courses` - 获取课程列表
- `GET /api/courses/:id` - 获取课程详情
- `POST /api/courses` - 创建课程（需要 instructor/admin 权限）
- `PATCH /api/courses/:id` - 更新课程
- `DELETE /api/courses/:id` - 删除课程

### 资源相关

- `GET /api/resources` - 获取资源列表
- `POST /api/resources` - 上传资源（需要 instructor/admin 权限）
- `GET /api/resources/:id/download` - 下载资源

### 报名相关

- `POST /api/enrollments` - 申请报名
- `GET /api/enrollments/my` - 我的报名记录

### 审批相关

- `GET /api/approvals` - 获取审批队列（需要 admin 权限）
- `PATCH /api/approvals/:id` - 处理审批（需要 admin 权限）

## 开发规范

详见 `CLAUDE.md`

## License

MIT
