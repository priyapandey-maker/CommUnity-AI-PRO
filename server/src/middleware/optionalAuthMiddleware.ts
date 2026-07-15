import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserResponse } from '@community-ai/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserResponse;
    req.user = decoded;
  } catch (err) {
    // Ignore invalid tokens for optional auth
  }
  next();
};
