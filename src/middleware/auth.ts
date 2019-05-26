import { Request, Response } from "express";

export function authMiddleware (req: Request, res: Response, next) {
  req.isAuthenticated()
    ? next()
    : res.redirect('/login');
}
