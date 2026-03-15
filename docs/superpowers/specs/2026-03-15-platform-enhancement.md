# AI 培训平台功能增强设计规格

**日期：** 2026-03-15
**状态：** 已批准
**技术栈：** React 18 + TypeScript + Vite / Node.js + Express / Framer Motion

---

## 一、项目背景

本平台定位为**产教融合 · 师资培训 · AI 赋能教育**的混合制培训平台，依托科大讯飞 AI 技术能力，同时服务三类受众：

- **高校师生**：产教融合课程、AI 赋能教学实训
- **企业员工**：技能提升、岗位认证、团队培训
- **个人学员**：自主学习、证书获取、职业发展

本次增强涵盖四个模块：首页重构、课程与资源扩充、报名表单增强、我的学习重构。

---

## 二、模块一：首页重构

### 2.1 定位主张

去除星火大模型视觉元素，核心主张聚焦：
> **产教融合 · 师资培训 · AI 赋能教育**

### 2.2 页面区块设计

**区块 1 - Hero**
- 主标题：「讯飞 AI 培训平台 · 产教融合」
- 副标题：「汇聚 AI 核心技术，赋能高校师资，助力教育数字化转型」
- 两个 CTA 按钮：「浏览课程」「了解产教融合」
- 背景：深色渐变 + 几何光效（纯 CSS，无需外部图片）

**区块 2 - 数据展示带**
- 四个数字指标横向排列：
  - `3000+` 培训学员
  - `50+` 精品课程
  - `20+` 合作高校
  - `98%` 学员好评

**区块 3 - 三类受众入口**
- 三张卡片，hover 时上浮 + 边框高亮：
  - 🎓 **高校师生** — 产教融合课程、AI 教学工具实训、师资能力提升
  - 🏢 **企业员工** — 技能提升培训、岗位 AI 认证、团队定制方案
  - 👤 **个人学员** — 自主学习路径、完课证书、职业发展指导

**区块 4 - 精选课程预览**
- 展示 3 门精选课程卡片（封面图、标签、学员数）
- 底部「查看全部课程」链接

**区块 5 - 合作伙伴**
- 文字版合作机构展示（高校 + 企业各 4-5 个）
- 标题：「携手共建 AI 教育生态」

**区块 6 - 底部 CTA**
- 标题：「立即加入，开启 AI 学习之旅」
- 说明：持有邀请码可直接激活账号
- 按钮：「免费注册」

### 2.3 验收标准
- ✅ 首页清晰传达产教融合定位
- ✅ 三类受众入口可点击跳转到课程列表（带筛选参数）
- ✅ 数据带和合作伙伴区块有滚动淡入动画
- ✅ 移动端响应式正常

---

## 三、模块二：课程列表 & 资源库扩充

### 3.1 课程数据（8 门）

| ID | 课程名称 | 方向 | 难度 | 课时 | 学员数 | 标签 |
|----|---------|------|------|------|--------|------|
| course-demo-001 | AI 基础入门 | AI 基础 | 入门 | 12 | 1280 | 理论·入门 |
| course-demo-002 | Python 与机器学习实战 | AI 基础 | 入门 | 20 | 960 | 实践·入门 |
| course-demo-003 | AI 赋能课堂教学设计 | 师资培训 | 中级 | 16 | 540 | 师资·教法 |
| course-demo-004 | 智慧课堂工具应用实训 | 师资培训 | 中级 | 10 | 380 | 师资·工具 |
| course-demo-005 | 大语言模型开发实战 | 大模型应用 | 进阶 | 24 | 720 | 开发·进阶 |
| course-demo-006 | RAG 与知识库构建 | 大模型应用 | 进阶 | 18 | 430 | 架构·进阶 |
| course-demo-007 | AI 产品设计与落地 | AI 产品 | 中级 | 14 | 610 | 产品·设计 |
| course-demo-008 | 企业 AI 转型实践 | AI 产品 | 中级 | 8 | 290 | 企业·案例 |

首页精选课程：取 `student_count` 最高的前 3 门（course-demo-001、course-demo-005、course-demo-003）。

**Course 类型新增字段：**
```typescript
category: 'ai-basics' | 'teacher-training' | 'llm' | 'ai-product'
difficulty: 'beginner' | 'intermediate' | 'advanced'
duration_hours: number   // 课时数
student_count: number    // 学员数（演示数据）
tags: string[]
```

### 3.2 课程列表页改造

- 顶部分类 Tab：全部 / AI 基础 / 师资培训 / 大模型应用 / AI 产品
- 课程卡片展示：封面图、分类标签（色块）、难度标识、课时数、学员数
- 卡片 hover 动画（上浮 + 阴影）

### 3.3 资源数据（12 个，覆盖 5 种类型）

| 类型 | 数量 | 示例 |
|------|------|------|
| 视频 | 3 | 专家讲座录播、课程精华片段 |
| 课件 | 3 | PPT 课件、教学幻灯片 |
| 讲义 | 3 | PDF 讲义、学习手册 |
| 实验 | 2 | Jupyter Notebook 实验包 |
| 工具包 | 1 | 代码模板与配置文件 |

**Resource 类型扩展：**
```typescript
file_type: 'pdf' | 'video' | 'ppt' | 'notebook' | 'zip' | 'image'
resource_type: 'video' | 'slides' | 'handout' | 'lab' | 'toolkit'
download_count: number
```

### 3.4 资源库页改造

- 顶部类型筛选 Tab：全部 / 视频 / 课件 / 讲义 / 实验 / 工具包
- 每张卡片：类型图标（emoji）、文件大小、下载次数、登录锁图标（未登录时）
- 未登录用户点击下载 → 提示「请先登录」

### 3.5 验收标准
- ✅ 课程列表分类筛选正常工作
- ✅ 资源库类型筛选正常工作
- ✅ 未登录用户无法下载资源
- ✅ 演示数据完整展示

---

## 四、模块三：报名表单增强

### 4.1 交互设计

点击「申请报名」→ 弹出 Modal 表单，分两步：

**Step 1 / 2 — 基础信息**
```
姓名*        [预填自账号，可修改]
手机号*      [输入框，11位验证]
单位/学校*   [输入框]
职位/专业*   [输入框]
```

**Step 2 / 2 — 学习背景**
```
技术基础*    ○ 零基础  ○ 有一定基础  ○ 进阶学习者
身份标识*    ○ 高校学生  ○ 高校教师  ○ 企业员工  ○ 讯飞员工  ○ 个人学员
学习目标     [文本域，100字以内，选填]
微信号       [输入框，选填]
备用邮箱     [输入框，选填]
```

### 4.2 数据结构变更

`Enrollment` 完整接口（含本次新增字段）：
```typescript
interface Enrollment {
  id: string
  user_id: string
  course_id: string
  status: EnrollmentStatus
  progress: number           // 0-100，百分比
  enrolled_at: Date
  completed_at: Date | null  // 新增：完成时间
  study_time: number         // 新增：累计学习分钟数
  enrollment_info: {         // 新增：报名信息
    phone: string
    organization: string
    position: string
    tech_level: 'beginner' | 'intermediate' | 'advanced'
    identity: 'student' | 'teacher' | 'enterprise' | 'iflytek' | 'individual'
    learning_goal?: string
    wechat?: string
    backup_email?: string
  } | null
}
```

内存数据库 `enrollments` 数组同步支持该字段。

### 4.3 未登录用户行为

- 未登录用户点击「申请报名」→ 直接跳转 `/login`，不显示弹窗
- 登录后返回课程详情页，可正常报名

### 4.3 验收标准
- ✅ 两步表单流程正常，可前后切换
- ✅ 必填字段验证（手机号格式、必填项）
- ✅ 提交后显示成功提示，关闭弹窗
- ✅ 未登录用户点击报名 → 跳转登录页

---

## 五、模块四：我的学习重构

### 5.1 页面结构

四个 Tab 切换，默认显示「我的课程」：

**Tab 1 - 我的课程**

三个状态分组（Accordion 或分组列表）：
- **学习中**：课程卡片 + 进度条 + 「继续学习」按钮
- **已完成**：课程卡片 + 完成日期 + 「查看证书」按钮
- **待审批**：课程卡片 + 「等待管理员审批」状态标签

**Tab 2 - 学习记录**

顶部三个统计卡片：
- 本周学习时长（小时）
- 本月学习时长（小时）
- 累计学习时长（小时）

最近 7 天热力图：7 个色块，有学习记录的日期显示高亮色，无记录显示灰色。

最近学习列表：课程名 + 章节名 + 学习时间（最近 10 条）。

**Tab 3 - 我的证书**

已完成课程自动生成证书卡片：
```
┌─────────────────────────────┐
│  🏆  完课证书                │
│  课程名称                    │
│  完成日期：2026-03-15        │
│  证书编号：CERT-XXXX-XXXX   │
└─────────────────────────────┘
```
未完成课程显示进度提示「还差 X% 完成课程」。

**Tab 4 - 我的收藏**

已下载资源列表：类型图标 + 资源名 + 下载时间 + 「重新下载」按钮。

### 5.2 数据结构变更

`Enrollment` 新增字段见第 4.2 节（`study_time`、`completed_at`、`enrollment_info`）。

内存数据库新增 `downloads` 数组记录下载历史：
```typescript
interface Download {
  id: string
  user_id: string
  resource_id: string
  downloaded_at: Date
}
```

**证书生成逻辑：** 纯前端计算，当 `enrollment.progress === 100` 时，在「我的证书」Tab 渲染证书卡片，无需后端接口。证书编号格式：`CERT-{course_id 前4位}-{user_id 前4位}-{年份}`。

**学习热力图：** 显示过去 7 天（含今天），基于 `enrollments` 中 `study_time > 0` 的记录判断当天是否有学习，无最小时长阈值。注册不足 7 天的用户，早于注册日期的格子显示灰色。

### 5.3 验收标准
- ✅ 四个 Tab 切换正常
- ✅ 进度条根据 progress 字段正确渲染
- ✅ 证书卡片仅在 progress === 100 时显示
- ✅ 收藏列表展示下载历史

---

## 六、文件变更清单

**新增文件：**
- `src/frontend/components/EnrollmentModal.tsx` — 报名弹窗组件（两步表单）
- `src/frontend/components/CourseCard.tsx` — 重构课程卡片（带分类/难度/课时/学员数）
- `src/frontend/components/ResourceCard.tsx` — 重构资源卡片（带类型图标/下载数/锁图标）
- `src/frontend/components/CertificateCard.tsx` — 证书卡片组件
- `src/frontend/components/StudyHeatmap.tsx` — 学习热力图组件（7天）

**修改文件：**
- `src/shared/types.ts` — 扩展 Course（新增 category/difficulty/duration_hours/student_count/tags）、Resource（新增 resource_type/download_count）、Enrollment（新增 completed_at/study_time/enrollment_info），新增 Download 接口
- `src/backend/db.ts` — 扩充演示数据（8门课程、12个资源），新增 downloads 数组及查询逻辑
- `src/backend/controllers/enrollments.controller.ts` — 支持 enrollment_info 字段提交
- `src/frontend/pages/Home.tsx` — 完整重构（6个区块）
- `src/frontend/pages/CourseList.tsx` — 添加分类筛选 Tab
- `src/frontend/pages/CourseDetail.tsx` — 集成 EnrollmentModal，未登录跳转登录页
- `src/frontend/pages/ResourceLibrary.tsx` — 添加类型筛选 Tab，未登录禁用下载
- `src/frontend/pages/MyLearning.tsx` — 完整重构为四 Tab

**未登录用户 UI 规则：**
- 资源下载按钮：显示但禁用，hover 提示「请先登录」
- 报名按钮：点击直接跳转 `/login`

---

## 七、不在本次范围内

- 真实文件上传/下载（保持 mock URL）
- 视频播放器（保持链接跳转）
- 管理员审批界面改动
- 付费/订单系统
