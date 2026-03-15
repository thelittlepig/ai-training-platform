import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../shared/types';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        code: 403,
        message: 'Forbidden',
        data: null,
      });
    }

    next();
  };
};
