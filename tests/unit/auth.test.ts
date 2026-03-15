import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../src/backend/middleware/authenticate';
import { authorize } from '../../src/backend/middleware/authorize';
import { login } from '../../src/backend/controllers/auth.controller';
import * as userModel from '../../src/backend/models/user.model';
import jwt from 'jsonwebtoken';

describe('authenticate middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should reject request without authorization header', () => {
    authenticate(mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 401,
      message: 'No token provided',
      data: null,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token', () => {
    mockReq.headers = { authorization: 'Bearer invalid-token' };
    authenticate(mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should accept request with valid token', () => {
    const token = jwt.sign({ id: 'user-123', role: 'learner' }, process.env.JWT_SECRET || 'test-secret');
    mockReq.headers = { authorization: `Bearer ${token}` };
    authenticate(mockReq as Request, mockRes as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect((mockReq as any).user).toMatchObject({ id: 'user-123', role: 'learner' });
  });
});

describe('authorize middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should reject if user role not in allowed roles', () => {
    (mockReq as any).user = { id: 'user-123', role: 'learner' };
    const middleware = authorize('admin', 'instructor');
    middleware(mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 403,
      message: 'Forbidden',
      data: null,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should allow if user role in allowed roles', () => {
    (mockReq as any).user = { id: 'user-123', role: 'admin' };
    const middleware = authorize('admin', 'instructor');
    middleware(mockReq as Request, mockRes as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe('login controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it('should return 400 if email is missing', async () => {
    mockReq.body = { password: 'test123' };
    await login(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 400,
      message: 'Missing email or password',
      data: null,
    });
  });

  it('should return 400 if password is missing', async () => {
    mockReq.body = { email: 'test@example.com' };
    await login(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 400,
      message: 'Missing email or password',
      data: null,
    });
  });

  it('should return 401 if credentials are invalid', async () => {
    mockReq.body = { email: 'test@example.com', password: 'wrong' };
    jest.spyOn(userModel, 'verifyPassword').mockResolvedValue(null);
    await login(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 401,
      message: 'Invalid credentials',
      data: null,
    });
  });

  it('should return 403 if account is not activated', async () => {
    mockReq.body = { email: 'test@example.com', password: 'test123' };
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'learner',
      status: 'pending',
    };
    jest.spyOn(userModel, 'verifyPassword').mockResolvedValue(mockUser as any);
    await login(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 403,
      message: 'Account not activated',
      data: null,
    });
  });

  it('should return 200 with token if login is successful', async () => {
    mockReq.body = { email: 'test@example.com', password: 'test123' };
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'learner',
      status: 'active',
    };
    jest.spyOn(userModel, 'verifyPassword').mockResolvedValue(mockUser as any);
    await login(mockReq as Request, mockRes as Response);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 200,
        message: 'Login successful',
        data: expect.objectContaining({
          user: mockUser,
          token: expect.any(String),
        }),
      })
    );
  });

  it('should return 500 if an unexpected error occurs', async () => {
    mockReq.body = { email: 'test@example.com', password: 'test123' };
    jest.spyOn(userModel, 'verifyPassword').mockRejectedValue(new Error('Database error'));
    await login(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  });
});
