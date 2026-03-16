import { Request, Response } from 'express';
import { createUser, verifyPassword } from '../models/user.model';
import { createApprovalRequest } from '../models/approval.model';
import jwt, { SignOptions } from 'jsonwebtoken';

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

    const user = await createUser(name, email, password, inviteCode);

    // 如果使用了有效邀请码，账号已激活，无需审批
    if (user.status === 'active') {
      return res.status(201).json({
        code: 201,
        message: 'Registration successful, account activated',
        data: user,
      });
    }

    // 否则创建注册审批请求
    await createApprovalRequest(user.id, 'registration');

    return res.status(201).json({
      code: 201,
      message: 'Registration submitted, awaiting approval',
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN] Attempt for email: ${email}`);

    if (!email || !password) {
      console.log('[LOGIN] Missing credentials');
      return res.status(400).json({
        code: 400,
        message: 'Missing email or password',
        data: null,
      });
    }

    console.log('[LOGIN] Verifying password...');
    const user = await verifyPassword(email, password);

    if (!user) {
      console.log('[LOGIN] Invalid credentials for:', email);
      return res.status(401).json({
        code: 401,
        message: 'Invalid credentials',
        data: null,
      });
    }

    console.log(`[LOGIN] User found: ${user.id}, status: ${user.status}, role: ${user.role}`);

    if (user.status !== 'active') {
      console.log(`[LOGIN] Account not activated: ${user.id}`);
      return res.status(403).json({
        code: 403,
        message: 'Account not activated',
        data: null,
      });
    }

    console.log('[LOGIN] Generating JWT token...');
    const jwtSecret: string = process.env.JWT_SECRET || 'test-secret';
    const rawExpiry = process.env.JWT_EXPIRES_IN || '7d';
    const cleanExpiry = rawExpiry.replace(/['"]/g, '') || '7d';
    const jwtOptions: SignOptions = { expiresIn: '7d' }; // 硬编码兜底，避免环境变量格式问题
    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      jwtOptions
    );

    console.log(`[LOGIN] Success for user: ${user.id}`);
    return res.json({
      code: 200,
      message: 'Login successful',
      data: { user, token },
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};
