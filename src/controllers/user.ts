import { Request, Response } from "express";
import passport from "passport";

import User from "../models/user";

export function login (req: Request, res: Response, next) {
  passport.authenticate('local',
    function(err, user) {
      return err
        ? next(err)
        : user
          ? req.logIn(user, function(err) {
            return err
              ? next(err)
              : res.redirect('/private');
          })
          : res.redirect('/');
    }
  )(req, res, next);
}

export function logout (req: Request, res: Response) {
  req.logout();
  res.redirect('/');
}

export function register (req: Request, res: Response, next) {
  console.log(req.body);
  console.log(req.params);
  const user = new User({ username: req.body.email, password: req.body.password});
  user.save(function(err) {
    return err
      ? next(err)
      : req.logIn(user, function(err) {
        return err
          ? next(err)
          : res.redirect('/private');
      });
  });
}


