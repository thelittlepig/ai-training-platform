# AI 培训平台改进实施计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复登录问题、实现邀请码注册、优化 UI 为苹果风格、预置示例数据

**Architecture:** 渐进式修复策略，按优先级依次实施四个阶段：登录修复 → 邀请码系统 → UI 优化 → 预置数据。每个阶段独立可验证。

**Tech Stack:** React 18 + TypeScript + Vite / Node.js + Express + PostgreSQL / Framer Motion / Jest + Playwright

---

## 文件结构

本计划将修改和创建以下文件：

**阶段 1 - 登录修复：**
- Modify: `src/backend/index.ts` - 添加 CORS 配置
- Modify: `src/backend/db.ts` - 添加连接测试
- Modify: `src/backend/controllers/auth.controller.ts` - 添加日志
- Modify: `src/frontend/hooks/useAuth.ts` - 添加日志和错误处理
- Create: `tests/backend/auth.test.ts` - 登录测试

**阶段 2 - 邀请码系统：**
- Modify: `src/backend/models/user.model.ts` - 支持 status 参数
- Modify: `src/backend/controllers/auth.controller.ts` - 邀请码逻辑
- Modify: `src/frontend/pages/Register.tsx` - 邀请码输入框
- Create: `tests/backend/invite-code.test.ts` - 邀请码测试
- Create: `tests/e2e/invite-code-registration.spec.ts` - E2E 测试

**阶段 3 - UI 优化：**
- Create: `src/frontend/styles/globals.css` - 全局样式
- Create: `src/frontend/components/FadeIn.tsx` - 动画组件
- Create: `src/frontend/components/Button.tsx` - 按钮组件
- Create: `src/frontend/components/Card.tsx` - 卡片组件
- Create: `src/frontend/components/Toast.tsx` - 通知组件
- Create: `src/frontend/components/Navbar.tsx` - 导航栏
- Modify: `src/frontend/pages/Home.tsx` - 苹果风格首页
- Modify: `src/frontend/pages/CourseList.tsx` - 优化课程列表
- Modify: `src/frontend/pages/CourseDetail.tsx` - 优化课程详情
- Modify: `src/frontend/components/CourseCard.tsx` - 优化课程卡片

**阶段 4 - 预置数据：**
- Create: `migrations/seed-demo-data.sql` - 示例数据脚本
- Create: `scripts/seed-demo-data.sh` - 执行脚本

---

## Chunk 1: 阶段 1 - 登录问题诊断与修复

### Task 1: 添加后端 CORS 配置

**Files:**
- Modify: `src/backend/index.ts`

- [ ] **Step 1: 安装 cors 依赖**

Run: `npm install cors @types/cors`
Expected: 依赖安装成功

- [ ] **Step 2: 在 backend/index.ts 中添加 CORS 配置**

在文件顶部导入 cors：
```typescript
import cors from 'cors';
```

在创建 app 后，路由之前添加：
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

- [ ] **Step 3: 更新 .env 文件**

Add to `.env`:
```
FRONTEND_URL=http://localhost:5173
```

- [ ] **Step 4: 重启后端服务器验证**

Run: `npm run dev` (in backend terminal)
Expected: 服务器正常启动，无 CORS 错误

- [ ] **Step 5: Commit**

```bash
git add src/backend/index.ts .env
git commit -m "fix: 添加 CORS 配置支持前后端跨域请求

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 2: 添加数据库连接测试

**Files:**
- Modify: `src/backend/db.ts`
- Modify: `src/backend/index.ts`

- [ ] **Step 1: 在 db.ts 中添加连接测试函数**

在文件末尾添加：
```typescript
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};
```

- [ ] **Step 2: 在 index.ts 启动时测试连接**

在文件顶部导入：
```typescript
import { testConnection } from './db';
```

在 app.listen 之前添加：
```typescript
testConnection().then((connected) => {
  if (!connected) {
    console.error('Failed to connect to database. Please check DATABASE_URL');
    process.exit(1);
  }
});
```

- [ ] **Step 3: 运行后端服务器验证**

Run: `npm run dev`
Expected: 看到 "✅ Database connected successfully" 消息

- [ ] **Step 4: Commit**

```bash
git add src/backend/db.ts src/backend/index.ts
git commit -m "feat: 添加数据库连接测试

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 3: 添加详细的登录日志

**Files:**
- Modify: `src/backend/controllers/auth.controller.ts`
- Modify: `src/frontend/hooks/useAuth.ts`

- [ ] **Step 1: 在后端 auth.controller.ts 添加日志**

在 login 函数中添加详细日志：
```typescript
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', { email });

    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({
        code: 400,
        message: 'Missing email or password',
        data: null,
      });
    }

    const user = await verifyPassword(email, password);
    console.log('👤 User verification result:', user ? 'Found' : 'Not found');

    if (!user) {
      console.log('❌ Invalid credentials for:', email);
      return res.status(401).json({
        code: 401,
        message: 'Invalid credentials',
        data: null,
      });
    }

    if (user.status !== 'active') {
      console.log('⏳ Account not activated:', email, 'status:', user.status);
      return res.status(403).json({
        code: 403,
        message: 'Account not activated',
        data: null,
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    console.log('✅ Login successful:', email);
    return res.json({
      code: 200,
      message: 'Login successful',
      data: { user, token },
    });
  } catch (error) {
    console.error('💥 Login error:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};
```

- [ ] **Step 2: 在前端 useAuth.ts 添加日志**

在 login 函数中添加：
```typescript
const login = async (email: string, password: string) => {
  try {
    console.log('🔐 Attempting login:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('📥 Login response:', response);

    if (response.code === 200 && response.data) {
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      console.log('✅ Login successful, user:', user);
    } else {
      console.log('❌ Login failed:', response.message);
      throw new Error(response.message);
    }
  } catch (error: any) {
    console.error('💥 Login error:', error);
    throw error;
  }
};
```

- [ ] **Step 3: 测试登录流程**

1. 打开浏览器控制台
2. 访问 /login 页面
3. 输入测试账号密码
4. 观察控制台日志

Expected: 看到详细的登录流程日志

- [ ] **Step 4: Commit**

```bash
git add src/backend/controllers/auth.controller.ts src/frontend/hooks/useAuth.ts
git commit -m "feat: 添加详细的登录日志用于调试

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 4: 优化错误提示

**Files:**
- Modify: `src/frontend/hooks/useAuth.ts`

- [ ] **Step 1: 改进错误消息映射**

在 login 函数中添加错误映射：
```typescript
const login = async (email: string, password: string) => {
  try {
    console.log('🔐 Attempting login:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('📥 Login response:', response);

    if (response.code === 200 && response.data) {
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      console.log('✅ Login successful, user:', user);
    } else {
      console.log('❌ Login failed:', response.message);

      // 映射错误消息为用户友好的中文提示
      const errorMessages: Record<number, string> = {
        400: '请输入邮箱和密码',
        401: '邮箱或密码错误',
        403: '账号未激活，请等待管理员审批',
        500: '服务器错误，请稍后重试',
      };

      const message = errorMessages[response.code] || response.message;
      throw new Error(message);
    }
  } catch (error: any) {
    console.error('💥 Login error:', error);

    // 处理网络错误
    if (!error.response && error.message === 'Network Error') {
      throw new Error('网络连接失败，请检查网络设置');
    }

    throw error;
  }
};
```

- [ ] **Step 2: 测试各种错误场景**

Test cases:
1. 空邮箱/密码 → "请输入邮箱和密码"
2. 错误密码 → "邮箱或密码错误"
3. 未激活账号 → "账号未激活，请等待管理员审批"
4. 断网 → "网络连接失败，请检查网络设置"

- [ ] **Step 3: Commit**

```bash
git add src/frontend/hooks/useAuth.ts
git commit -m "feat: 优化登录错误提示信息

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 5: 编写登录功能测试

**Files:**
- Create: `tests/backend/auth.test.ts`

- [ ] **Step 1: 创建测试文件**

```typescript
import request from 'supertest';
import app from '../../src/backend/index';
import { createUser } from '../../src/backend/models/user.model';

describe('登录功能测试', () => {
  beforeAll(async () => {
    // 创建测试用户
    await createUser('Test User', 'test@example.com', 'password123', 'active');
  });

  it('正确的邮箱密码应该登录成功', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.token).toBeDefined();
  });

  it('错误的密码应该返回 401', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('未激活的账号应该返回 403', async () => {
    await createUser('Pending User', 'pending@example.com', 'password123', 'pending');

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'pending@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Account not activated');
  });
});
```

- [ ] **Step 2: 运行测试**

Run: `npm test -- tests/backend/auth.test.ts`
Expected: 所有测试通过

- [ ] **Step 3: Commit**

```bash
git add tests/backend/auth.test.ts
git commit -m "test: 添加登录功能测试

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Chunk 2: 阶段 2 - 邀请码双路径注册系统

### Task 6: 修改用户模型支持 status 参数

**Files:**
- Modify: `src/backend/models/user.model.ts`

- [ ] **Step 1: 编写测试**

Create: `tests/backend/user-model.test.ts`

```typescript
import { createUser } from '../../src/backend/models/user.model';

describe('用户模型测试', () => {
  it('创建用户时应该使用指定的 status', async () => {
    const user = await createUser('Test User', 'test-active@example.com', 'password123', 'active');
    expect(user.status).toBe('active');
  });

  it('未指定 status 时应该默认为 pending', async () => {
    const user = await createUser('Test User', 'test-pending@example.com', 'password123');
    expect(user.status).toBe('pending');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- tests/backend/user-model.test.ts`
Expected: 测试失败（因为 createUser 还不支持 status 参数）

- [ ] **Step 3: 修改 user.model.ts**

修改 createUser 函数签名，添加 status 参数：
```typescript
export const createUser = async (
  name: string,
  email: string,
  password: string,
  status: string = 'pending'
): Promise<User> => {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    'INSERT INTO users (name, email, password_hash, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status, created_at',
    [name, email, passwordHash, 'learner', status]
  );
  return result.rows[0];
};
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- tests/backend/user-model.test.ts`
Expected: 所有测试通过

- [ ] **Step 5: Commit**

```bash
git add src/backend/models/user.model.ts tests/backend/user-model.test.ts
git commit -m "feat: 用户模型支持自定义 status 参数

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 7: 实现后端邀请码验证逻辑

**Files:**
- Modify: `src/backend/controllers/auth.controller.ts`

- [ ] **Step 1: 编写测试**

Create: `tests/backend/invite-code.test.ts`

```typescript
import request from 'supertest';
import app from '../../src/backend/index';

describe('邀请码注册系统', () => {
  it('使用有效邀请码注册应立即激活', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test-invite@example.com',
        password: 'password123',
        inviteCode: 'cll123',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe('active');
    expect(response.body.message).toContain('you can login now');
  });

  it('使用无效邀请码注册应进入审批流程', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test-invalid@example.com',
        password: 'password123',
        inviteCode: 'invalid',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe('pending');
    expect(response.body.message).toContain('awaiting approval');
  });

  it('不提供邀请码应进入审批流程', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test-no-invite@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe('pending');
    expect(response.body.message).toContain('awaiting approval');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- tests/backend/invite-code.test.ts`
Expected: 测试失败（因为邀请码逻辑还未实现）

- [ ] **Step 3: 修改 auth.controller.ts 实现邀请码逻辑**

在文件顶部添加常量：
```typescript
const VALID_INVITE_CODE = 'cll123';
```

修改 register 函数：
```typescript
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: 'Missing required fields',
        data: null,
      });
    }

    // 检查邀请码
    const hasValidInviteCode = inviteCode === VALID_INVITE_CODE;
    const initialStatus = hasValidInviteCode ? 'active' : 'pending';

    // 创建用户
    const user = await createUser(name, email, password, initialStatus);

    // 如果没有有效邀请码，创建审批请求
    if (!hasValidInviteCode) {
      await createApprovalRequest(user.id, 'registration');
      return res.status(201).json({
        code: 201,
        message: 'Registration submitted, awaiting approval',
        data: user,
      });
    }

    // 有效邀请码，直接激活
    return res.status(201).json({
      code: 201,
      message: 'Registration successful, you can login now',
      data: user,
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({
        code: 409,
        message: 'Email already exists',
        data: null,
      });
    }
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- tests/backend/invite-code.test.ts`
Expected: 所有测试通过

- [ ] **Step 5: Commit**

```bash
git add src/backend/controllers/auth.controller.ts tests/backend/invite-code.test.ts
git commit -m "feat: 实现邀请码双路径注册系统

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 8: 前端添加邀请码输入框

**Files:**
- Modify: `src/frontend/pages/Register.tsx`

- [ ] **Step 1: 添加邀请码状态**

在组件顶部添加状态：
```typescript
const [inviteCode, setInviteCode] = useState('');
```

- [ ] **Step 2: 修改提交逻辑**

在 handleSubmit 函数中添加 inviteCode：
```typescript
const response = await api.post('/auth/register', {
  name,
  email,
  password,
  inviteCode: inviteCode || undefined,
});

if (response.code === 201) {
  // 根据不同的消息显示不同的提示
  if (response.message.includes('you can login now')) {
    setMessage('注册成功！正在跳转到登录页面...');
    setTimeout(() => navigate('/login'), 1500);
  } else {
    setMessage('注册成功，等待管理员审批');
    setTimeout(() => navigate('/login'), 2000);
  }
}
```

- [ ] **Step 3: 添加邀请码输入框**

在密码输入框后添加：
```typescript
<div style={{ marginBottom: '24px' }}>
  <label htmlFor="inviteCode">邀请码（可选）</label>
  <input
    id="inviteCode"
    type="text"
    value={inviteCode}
    onChange={(e) => setInviteCode(e.target.value)}
    placeholder="有邀请码可跳过审批"
    style={{ width: '100%', marginTop: '8px' }}
  />
  <p style={{
    fontSize: '12px',
    color: '#64748b',
    marginTop: '4px',
    lineHeight: '1.4',
  }}>
    没有邀请码？注册后需等待管理员审批
  </p>
</div>
```

- [ ] **Step 4: 测试邀请码注册流程**

Test cases:
1. 使用邀请码 "cll123" 注册 → 显示"注册成功！正在跳转到登录页面..."
2. 使用错误邀请码注册 → 显示"注册成功，等待管理员审批"
3. 不填邀请码注册 → 显示"注册成功，等待管理员审批"

- [ ] **Step 5: Commit**

```bash
git add src/frontend/pages/Register.tsx
git commit -m "feat: 前端添加邀请码输入框

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 9: E2E 测试邀请码注册流程

**Files:**
- Create: `tests/e2e/invite-code-registration.spec.ts`

- [ ] **Step 1: 创建 E2E 测试**

```typescript
import { test, expect } from '@playwright/test';

test.describe('邀请码注册流程', () => {
  test('使用有效邀请码注册并登录', async ({ page }) => {
    // 访问注册页面
    await page.goto('/register');

    // 填写注册表单
    const timestamp = Date.now();
    await page.fill('#name', 'Test User With Invite');
    await page.fill('#email', `test-invite-${timestamp}@example.com`);
    await page.fill('#password', 'password123');
    await page.fill('#inviteCode', 'cll123');

    // 提交表单
    await page.click('button[type="submit"]');

    // 验证成功消息
    await expect(page.locator('.success')).toContainText('注册成功！正在跳转到登录页面');

    // 等待跳转到登录页面
    await page.waitForURL('/login');

    // 登录
    await page.fill('#email', `test-invite-${timestamp}@example.com`);
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    // 验证登录成功
    await expect(page).toHaveURL('/');
  });

  test('不使用邀请码注册应进入审批流程', async ({ page }) => {
    await page.goto('/register');

    const timestamp = Date.now();
    await page.fill('#name', 'Test User No Invite');
    await page.fill('#email', `test-no-invite-${timestamp}@example.com`);
    await page.fill('#password', 'password123');
    // 不填写邀请码

    await page.click('button[type="submit"]');

    // 验证审批消息
    await expect(page.locator('.success')).toContainText('等待管理员审批');
  });
});
```

- [ ] **Step 2: 运行 E2E 测试**

Run: `npx playwright test tests/e2e/invite-code-registration.spec.ts`
Expected: 所有测试通过

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/invite-code-registration.spec.ts
git commit -m "test: 添加邀请码注册 E2E 测试

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Chunk 3: 阶段 3 - UI 全面优化（苹果风格）

### Task 10: 安装 Framer Motion 并创建全局样式

**Files:**
- Create: `src/frontend/styles/globals.css`

- [ ] **Step 1: 安装 Framer Motion**

Run: `npm install framer-motion`
Expected: 依赖安装成功

- [ ] **Step 2: 创建全局样式文件**

Create: `src/frontend/styles/globals.css`

```css
:root {
  /* 颜色系统 */
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;
  --color-accent: #38bdf8;
  --color-accent-light: #7dd3fc;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-tertiary: #64748b;

  /* 间距系统 */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 80px;
  --spacing-4xl: 120px;

  /* 阴影系统 */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);

  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.glass-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
```

- [ ] **Step 3: 在 main.tsx 中导入全局样式**

在 `src/frontend/main.tsx` 顶部添加：
```typescript
import './styles/globals.css';
```

- [ ] **Step 4: Commit**

```bash
git add src/frontend/styles/globals.css src/frontend/main.tsx package.json
git commit -m "feat: 添加全局样式系统和 Framer Motion

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 11: 创建可复用的动画组件

**Files:**
- Create: `src/frontend/components/FadeIn.tsx`

- [ ] **Step 1: 创建 FadeIn 组件**

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/frontend/components/FadeIn.tsx
git commit -m "feat: 添加 FadeIn 动画组件

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 12: 优化首页为苹果风格

**Files:**
- Modify: `src/frontend/pages/Home.tsx`

- [ ] **Step 1: 重写首页组件**

使用苹果风格的 Hero 区域和动画效果：
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';

const Home: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }}>
      {/* Hero 区域 */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 var(--spacing-lg)',
        textAlign: 'center',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          开启 AI 学习之旅
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: '20px',
            color: '#94a3b8',
            marginBottom: '40px',
            maxWidth: '600px',
          }}
        >
          专业的 AI 培训平台，助你掌握前沿技术
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/courses">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 48px',
                fontSize: '18px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              立即开始
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* 特色区域 */}
      <section style={{
        padding: 'var(--spacing-4xl) var(--spacing-lg)',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <FadeIn>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 'var(--spacing-3xl)',
          }}>
            为什么选择我们
          </h2>
        </FadeIn>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-xl)',
        }}>
          {[
            { title: '专业课程', desc: '由行业专家精心设计的 AI 课程' },
            { title: '实战项目', desc: '通过真实项目掌握 AI 技能' },
            { title: '社区支持', desc: '加入活跃的 AI 学习社区' },
          ].map((feature, index) => (
            <FadeIn key={index} delay={index * 0.2}>
              <div className="glass-card" style={{
                padding: 'var(--spacing-xl)',
                transition: 'transform 0.3s ease',
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-accent)',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6',
                }}>
                  {feature.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
```

- [ ] **Step 2: 测试首页效果**

1. 访问首页
2. 验证动画效果流畅
3. 验证按钮 hover 效果
4. 验证响应式布局

- [ ] **Step 3: Commit**

```bash
git add src/frontend/pages/Home.tsx
git commit -m "feat: 优化首页为苹果风格

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 13: 优化课程卡片组件

**Files:**
- Modify: `src/frontend/components/CourseCard.tsx`

- [ ] **Step 1: 重写课程卡片组件**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  coverImage,
}) => {
  return (
    <Link to={`/courses/${id}`} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="glass-card"
        style={{
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* 封面图 */}
        <div style={{
          width: '100%',
          height: '200px',
          background: coverImage
            ? `url(${coverImage}) center/cover`
            : 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
        }} />

        {/* 内容 */}
        <div style={{ padding: 'var(--spacing-lg)' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: 'var(--spacing-sm)',
            color: 'var(--color-text-primary)',
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
          }}>
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/frontend/components/CourseCard.tsx
git commit -m "feat: 优化课程卡片为苹果风格

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 14: 优化课程列表页

**Files:**
- Modify: `src/frontend/pages/CourseList.tsx`

- [ ] **Step 1: 重写课程列表页**

使用网格布局和动画效果：
```typescript
import React from 'react';
import { useCourses } from '../hooks/useCourses';
import { CourseCard } from '../components/CourseCard';
import { FadeIn } from '../components/FadeIn';

const CourseList: React.FC = () => {
  const { courses, loading } = useCourses();

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: 'var(--spacing-3xl) var(--spacing-lg)',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <FadeIn>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: 'var(--spacing-3xl)',
            textAlign: 'center',
          }}>
            探索课程
          </h1>
        </FadeIn>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--spacing-xl)',
        }}>
          {courses.map((course, index) => (
            <FadeIn key={course.id} delay={index * 0.1}>
              <CourseCard
                id={course.id}
                title={course.title}
                description={course.description}
                coverImage={course.cover_image}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
```

- [ ] **Step 2: 测试课程列表**

1. 访问课程列表页
2. 验证网格布局
3. 验证卡片动画
4. 验证响应式设计

- [ ] **Step 3: Commit**

```bash
git add src/frontend/pages/CourseList.tsx
git commit -m "feat: 优化课程列表页布局和动画

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Chunk 4: 阶段 4 - 预置示例数据

### Task 15: 创建示例数据 SQL 脚本

**Files:**
- Create: `migrations/seed-demo-data.sql`

- [ ] **Step 1: 创建 SQL 脚本**

```sql
-- 创建 instructor 用户
INSERT INTO users (id, name, email, password_hash, role, status, created_at)
VALUES (
  'instructor-demo-001',
  'AI 讲师团队',
  'instructor@ai-platform.com',
  '$2b$10$dummyhash',
  'instructor',
  'active',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 插入课程 1：AI 基础入门
INSERT INTO courses (id, title, description, cover_image, instructor_id, status, created_at)
VALUES (
  'course-001',
  'AI 基础入门',
  '从零开始学习人工智能的核心概念，包括机器学习、深度学习、神经网络等基础知识。适合零基础学员。',
  '/images/courses/ai-basics.jpg',
  'instructor-demo-001',
  'published',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 插入课程 1 的章节
INSERT INTO chapters (id, course_id, title, content, "order") VALUES
('chapter-001-01', 'course-001', '第一章：AI 简介', '# AI 简介\n\n人工智能（Artificial Intelligence）是计算机科学的一个分支...', 1),
('chapter-001-02', 'course-001', '第二章：机器学习基础', '# 机器学习基础\n\n机器学习是 AI 的核心技术之一...', 2),
('chapter-001-03', 'course-001', '第三章：深度学习入门', '# 深度学习入门\n\n深度学习是机器学习的一个子领域...', 3),
('chapter-001-04', 'course-001', '第四章：常用工具介绍', '# 常用工具介绍\n\nPython、TensorFlow、PyTorch...', 4),
('chapter-001-05', 'course-001', '第五章：实战案例', '# 实战案例\n\n图像分类、文本分析等实战项目...', 5)
ON CONFLICT (id) DO NOTHING;

-- 插入课程 2：大语言模型应用开发
INSERT INTO courses (id, title, description, cover_image, instructor_id, status, created_at)
VALUES (
  'course-002',
  '大语言模型应用开发',
  '掌握 GPT、Claude 等大语言模型的应用开发技巧，学习 Prompt 工程、API 集成和实战项目开发。',
  '/images/courses/llm-dev.jpg',
  'instructor-demo-001',
  'published',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 插入课程 2 的章节
INSERT INTO chapters (id, course_id, title, content, "order") VALUES
('chapter-002-01', 'course-002', '第一章：LLM 原理', '# LLM 原理\n\n大语言模型的工作原理和技术架构...', 1),
('chapter-002-02', 'course-002', '第二章：Prompt 工程', '# Prompt 工程\n\n如何设计有效的提示词...', 2),
('chapter-002-03', 'course-002', '第三章：API 集成', '# API 集成\n\n如何调用 OpenAI、Anthropic 等 API...', 3),
('chapter-002-04', 'course-002', '第四章：实战项目', '# 实战项目\n\n构建智能客服、内容生成等应用...', 4)
ON CONFLICT (id) DO NOTHING;

-- 插入课程 3：AI 产品设计与落地
INSERT INTO courses (id, title, description, cover_image, instructor_id, status, created_at)
VALUES (
  'course-003',
  'AI 产品设计与落地',
  '学习如何将 AI 技术转化为实际产品，包括需求分析、技术选型、原型设计和上线运营。',
  '/images/courses/ai-product.jpg',
  'instructor-demo-001',
  'published',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 插入课程 3 的章节
INSERT INTO chapters (id, course_id, title, content, "order") VALUES
('chapter-003-01', 'course-003', '第一章：需求分析', '# 需求分析\n\n如何识别和分析 AI 产品需求...', 1),
('chapter-003-02', 'course-003', '第二章：技术选型', '# 技术选型\n\n选择合适的 AI 技术和工具...', 2),
('chapter-003-03', 'course-003', '第三章：原型设计', '# 原型设计\n\n快速构建 AI 产品原型...', 3),
('chapter-003-04', 'course-003', '第四章：上线运营', '# 上线运营\n\n产品上线、监控和优化...', 4)
ON CONFLICT (id) DO NOTHING;

-- 插入资源
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at) VALUES
('resource-001', 'AI 技术白皮书 2026', '最新 AI 技术趋势和应用案例，涵盖大模型、多模态、AI Agent 等前沿领域', '/files/ai-whitepaper-2026.pdf', 'pdf', 2621440, 'instructor-demo-001', true, NOW()),
('resource-002', '机器学习算法速查表', '常用机器学习算法的原理、应用场景和代码示例', '/files/ml-algorithms-cheatsheet.pdf', 'pdf', 1258291, 'instructor-demo-001', true, NOW()),
('resource-003', 'Prompt 工程最佳实践指南', '提示词设计技巧、常见模式和优化方法', '/files/prompt-engineering-guide.pdf', 'pdf', 819200, 'instructor-demo-001', true, NOW()),
('resource-004', 'AI 开发工具包', '包含常用的 Python 库、工具和配置文件', '/files/ai-dev-toolkit.zip', 'zip', 15728640, 'instructor-demo-001', true, NOW()),
('resource-005', '大模型 API 调用示例代码', 'Python 和 JavaScript 的 API 调用示例', '/files/llm-api-examples.zip', 'zip', 5242880, 'instructor-demo-001', true, NOW()),
('resource-006', 'AI 产品案例分析视频', '成功 AI 产品的设计和实现案例分析', '/files/ai-product-cases.mp4', 'video', 52428800, 'instructor-demo-001', true, NOW()),
('resource-007', '神经网络可视化工具', '交互式神经网络结构可视化和训练过程演示工具', '/files/nn-visualizer.zip', 'zip', 8388608, 'instructor-demo-001', true, NOW()),
('resource-008', 'AI 伦理与安全指南', 'AI 应用的伦理考虑、安全风险和最佳实践', '/files/ai-ethics-guide.pdf', 'pdf', 1572864, 'instructor-demo-001', true, NOW())
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 2: Commit**

```bash
git add migrations/seed-demo-data.sql
git commit -m "feat: 添加示例数据 SQL 脚本

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 16: 创建执行脚本

**Files:**
- Create: `scripts/seed-demo-data.sh`

- [ ] **Step 1: 创建执行脚本**

```bash
#!/bin/bash

echo "开始导入示例数据..."

# 执行 SQL 脚本
psql $DATABASE_URL -f migrations/seed-demo-data.sql

if [ $? -eq 0 ]; then
  echo "✅ 示例数据导入完成！"
  echo "- 3 个课程"
  echo "- 13 个章节"
  echo "- 8 个资源"
else
  echo "❌ 示例数据导入失败"
  exit 1
fi
```

- [ ] **Step 2: 添加执行权限**

Run: `chmod +x scripts/seed-demo-data.sh`

- [ ] **Step 3: 执行脚本**

Run: `./scripts/seed-demo-data.sh`
Expected: 看到成功消息

- [ ] **Step 4: 验证数据**

1. 访问课程列表页
2. 验证显示 3 个课程
3. 访问资源库
4. 验证显示 8 个资源

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-demo-data.sh
git commit -m "feat: 添加示例数据执行脚本

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## 总结

实施计划已完成！包含 4 个阶段，16 个任务：

**阶段 1 - 登录修复（5 个任务）：**
- Task 1: 添加 CORS 配置
- Task 2: 添加数据库连接测试
- Task 3: 添加详细日志
- Task 4: 优化错误提示
- Task 5: 编写测试

**阶段 2 - 邀请码系统（4 个任务）：**
- Task 6: 修改用户模型
- Task 7: 实现邀请码逻辑
- Task 8: 前端添加输入框
- Task 9: E2E 测试

**阶段 3 - UI 优化（5 个任务）：**
- Task 10: 全局样式和 Framer Motion
- Task 11: 动画组件
- Task 12: 优化首页
- Task 13: 优化课程卡片
- Task 14: 优化课程列表

**阶段 4 - 预置数据（2 个任务）：**
- Task 15: SQL 脚本
- Task 16: 执行脚本

每个任务都遵循 TDD 原则，包含详细的代码示例和验收标准。

**下一步：** 使用 `superpowers:executing-plans` 或 `superpowers:subagent-driven-development` 执行此计划。


