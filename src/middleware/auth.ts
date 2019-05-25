import { Request, Response } from "express";

export function mustAuthenticatedMw (req: Request, res: Response, next) {
  req.isAuthenticated()
    ? next()
    : res.redirect('/login');
}
