import { Request, Response } from "express";
import passport from "passport";

import User from "../models/user";

export function login (req: Request, res: Response, next) {
  passport.authenticate('local',
    function(err, user) {
      if (err) {
        next(err);
        return;
      }
      if (!user) {
        res.redirect('/login');
      }
      req.logIn(user, function(err) {
        return err
          ? next(err)
          : res.redirect('/');
      })
    }
  )(req, res, next);
}

export function logout (req: Request, res: Response) {
  req.logout();
  res.redirect('/login');
}

export function register (req: Request, res: Response, next) {
  const user = new User({ username: req.body.email, password: req.body.password});
  user.save(function(err) {
    if (err) {
      next(err);
      return;
    }
    req.logIn(user, function(err) {
      return err
        ? next(err)
        : res.redirect('/');
    });
  });
}


