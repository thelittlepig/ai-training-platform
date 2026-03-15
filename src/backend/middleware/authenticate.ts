import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      code: 401,
      message: 'No token provided',
      data: null,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'Invalid token',
      data: null,
    });
  }
};
