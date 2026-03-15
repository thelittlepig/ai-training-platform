# AI 培训平台 — 设计文档

**日期：** 2026-03-15
**状态：** 已批准
**技术栈：** React 18 + TypeScript + Vite / Node.js + Express + PostgreSQL / Jest + Playwright

---

## 一、项目概述

面向企业内部员工与外部学员的混合制 AI 培训平台。平台提供两类内容：

- **培训资源**：独立文件素材（PDF、视频、工具包），可浏览和下载
- **培训课程**：结构化学习路径，包含多章节内容，学员需申请报名

访问模式为审批制：用户注册后需管理员审批激活，课程报名同样需要审批。

---

## 二、用户角色与权限

| 角色 | 说明 | 核心权限 |
|------|------|---------|
| Admin | 平台管理员 | 管理用户、审批注册/报名、发布下架内容、查看全量数据 |
| Instructor | 讲师/内容创作者 | 创建编辑课程与资源、查看自己课程的学员报名情况 |
| Learner | 学员 | 浏览课程和资源、申请报名、下载资源、查看学习进度 |

**注册流程：** 用户注册 → status=pending → Admin 审批 → status=active (Learner)
Admin 可手动将 Learner 提升为 Instructor。

---

## 三、页面结构

### 公开页面（未登录可访问）
- 首页 / Landing：平台介绍、精选课程、资源亮点
- 课程列表：浏览、搜索、筛选
- 课程详情：章节预览、报名入口
- 资源库：浏览、搜索、筛选（下载需登录）
- 登录 / 注册申请

### 学员页面（登录后）
- 我的学习：已报名课程、学习进度
- 课程章节阅读
- 资源下载
- 个人中心

### 管理后台（Admin / Instructor）
- 数据概览 Dashboard
- 用户管理 & 注册审批队列
- 课程创建/编辑（含章节管理）
- 资源上传管理
- 报名审批队列

---

## 四、数据模型

### users
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR | 姓名 |
| email | VARCHAR | 唯一，登录用 |
| password_hash | VARCHAR | bcrypt 加密 |
| role | ENUM | admin / instructor / learner |
| status | ENUM | pending / active / disabled |
| created_at | TIMESTAMP | |

### courses
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | VARCHAR | 课程标题 |
| description | TEXT | 课程简介 |
| cover_image | VARCHAR | 封面图 URL |
| instructor_id | UUID | FK → users |
| status | ENUM | draft / published |
| created_at | TIMESTAMP | |

### chapters
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| course_id | UUID | FK → courses |
| title | VARCHAR | 章节标题 |
| content | TEXT | Markdown 内容 |
| order | INTEGER | 排序 |

### resources
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | VARCHAR | 资源标题 |
| description | TEXT | 简介 |
| file_url | VARCHAR | 文件存储路径 |
| file_type | VARCHAR | pdf / video / zip 等 |
| file_size | BIGINT | 字节数 |
| uploaded_by | UUID | FK → users |
| is_public | BOOLEAN | 是否公开预览 |
| created_at | TIMESTAMP | |

### enrollments
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | FK → users |
| course_id | UUID | FK → courses |
| status | ENUM | pending / approved / rejected |
| progress | INTEGER | 已完成章节数 |
| enrolled_at | TIMESTAMP | |

### approval_requests
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | FK → users |
| type | ENUM | registration / enrollment |
| ref_id | UUID | enrollment_id（报名审批时） |
| status | ENUM | pending / approved / rejected |
| reviewed_by | UUID | FK → users (admin) |
| reviewed_at | TIMESTAMP | |

---

## 五、API 结构

所有路由前缀 `/api`，统一响应格式 `{ code, message, data }`。
每个请求经过两层中间件：`authenticate`（JWT 验证）→ `authorize(roles)`（角色检查）。

| 模块 | 路由前缀 | 主要端点 |
|------|---------|---------|
| 认证 | `/api/auth` | POST /register, POST /login, POST /logout, POST /refresh |
| 用户 | `/api/users` | GET /me, PATCH /me, GET / (admin), PATCH /:id/role (admin) |
| 审批 | `/api/approvals` | GET / (admin), PATCH /:id (admin 审批) |
| 课程 | `/api/courses` | GET /, GET /:id, POST / (instructor), PATCH /:id, DELETE /:id |
| 章节 | `/api/courses/:id/chapters` | GET /, POST /, PATCH /:chapterId, DELETE /:chapterId |
| 资源 | `/api/resources` | GET /, GET /:id, POST / (instructor), DELETE /:id, GET /:id/download |
| 报名 | `/api/enrollments` | POST / (申请), GET /my, PATCH /:id (admin 审批) |

---

## 六、前端结构

```
src/frontend/
├── pages/
│   ├── Home.tsx
│   ├── CourseList.tsx
│   ├── CourseDetail.tsx
│   ├── ResourceLibrary.tsx
│   ├── MyLearning.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── admin/
│       ├── Dashboard.tsx
│       ├── UserManagement.tsx
│       ├── CourseEditor.tsx
│       └── ApprovalQueue.tsx
├── components/
│   ├── CourseCard.tsx
│   ├── ResourceCard.tsx
│   ├── ChapterList.tsx
│   └── ProtectedRoute.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useCourses.ts
└── utils/
    └── api.ts
```

**状态管理：** React Context（auth 状态）+ React Query（服务端数据缓存）

---

## 七、测试策略

- **Jest**：单元测试，覆盖 utils、hooks、controllers，目标覆盖率 > 80%
- **Playwright**：E2E 测试，覆盖注册审批流程、课程报名、资源下载
- 测试命令：`npm test`

---

## 八、目录结构

```
project/
├── CLAUDE.md
├── src/
│   ├── frontend/          # React 18 + Vite
│   ├── backend/           # Node.js + Express
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   └── shared/            # 共享类型定义
├── tests/
├── docs/
│   └── superpowers/specs/
└── scripts/
```

---

## 九、视觉风格

深色专业风：深蓝/深灰底色（`#0f172a` / `#1e293b`），主色调天蓝（`#38bdf8`），科技感强。
