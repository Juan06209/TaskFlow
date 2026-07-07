import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global { namespace Express { interface Request { userId?: string } } }

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).json({ error: 'Authorization required' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization header' });
  const token = parts[1];
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
