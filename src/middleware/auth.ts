import { Request, Response } from "express";

export function authMiddleware (req: Request, res: Response, next) {
  if (!req.isAuthenticated()) {
    const err = new Error('Unauthorize');
    // @ts-ignore
    err.status = 401;
    next(err);
    return;
  }
  next();
}
