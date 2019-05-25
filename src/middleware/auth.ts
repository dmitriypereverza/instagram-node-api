import { Request, Response } from "express";

export function mustAuthenticatedMw (req: Request, res: Response, next) {

  console.log('isAuth', req.isAuthenticated());
  req.isAuthenticated()
    ? next()
    : res.redirect('/');
}
