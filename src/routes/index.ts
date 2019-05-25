import express from "express";
import cors from "cors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession from "express-session";

import accountRoute from "./account";
import botRoute from "./bot";
import userRoute from "./user";
import home from "./home";

import { mustAuthenticatedMw } from "../middleware/auth";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSession({
  secret: 'fotchKeaf'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/account', mustAuthenticatedMw, accountRoute);
app.use('/bot', botRoute);
app.use('/user', userRoute);
app.use('/', home);

import User, { UserType } from "../models/user";

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password,done){
  User.findOne({ username : username}, function(err, user: UserType){
    return err
      ? done(err)
      : user
        ? password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' })
        : done(null, false, { message: 'Incorrect username.' });
  });
}));
passport.serializeUser(function(user: UserType, done) {
  // @ts-ignore
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err
      ? done(err)
      : done(null, user);
  });
});

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  // @ts-ignore
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message,
    error: {}
  });
});

export default app;
