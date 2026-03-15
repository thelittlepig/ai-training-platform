import { test, expect } from '@playwright/test';

test.describe('AI Training Platform E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should load home page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('AI 培训平台');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=登录');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('登录');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=注册');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('h1')).toContainText('注册');
  });

  test('should navigate to courses page', async ({ page }) => {
    await page.click('text=课程列表');
    await expect(page).toHaveURL(/.*courses/);
    await expect(page.locator('h1')).toContainText('课程列表');
  });

  test('should navigate to resources page', async ({ page }) => {
    await page.click('text=资源库');
    await expect(page).toHaveURL(/.*resources/);
    await expect(page.locator('h1')).toContainText('资源库');
  });

  test('should register new user', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    const timestamp = Date.now();
    await page.fill('input[type="text"]', `Test User ${timestamp}`);
    await page.fill('input[type="email"]', `test${timestamp}@example.com`);
    await page.fill('input[type="password"]', 'password123');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=注册成功')).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error on empty login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.click('button[type="submit"]');

    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should register with valid invite code and activate immediately', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    const timestamp = Date.now();
    await page.fill('#name', `Invited User ${timestamp}`);
    await page.fill('#email', `invited${timestamp}@example.com`);
    await page.fill('#password', 'password123');
    await page.fill('#inviteCode', 'cll123');

    await page.click('button[type=\"submit\"]');

    await expect(page.locator('text=账号已激活')).toBeVisible({ timeout: 5000 });
  });

  test('should register without invite code and require approval', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    const timestamp = Date.now();
    await page.fill('#name', `Regular User ${timestamp}`);
    await page.fill('#email', `regular${timestamp}@example.com`);
    await page.fill('#password', 'password123');
    // 不填写邀请码

    await page.click('button[type=\"submit\"]');

    await expect(page.locator('text=等待管理员审批')).toBeVisible({ timeout: 5000 });
  });
});
