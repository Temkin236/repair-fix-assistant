import { Request, Response, NextFunction } from 'express';
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  req.userId = '1'; // Dummy user id
  next();
}
