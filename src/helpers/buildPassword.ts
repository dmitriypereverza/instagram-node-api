import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User, IUser } from "../models/user";

export default function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(username, password, done){
    User.findOne({ username : username}, function(err, user: IUser) {
      if (err) {
        done(err);
      }
      if (!user) {
        done(null, false, { message: 'Incorrect username.' })
      }
      if (password !== user.password) {
        done(null, false, { message: 'Incorrect password.' });
      }
      done(null, user);
    });
  }));
  passport.serializeUser(function(user: IUser, done) {
    // @ts-ignore
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      if (err) {
        done(err);
      }
      done(null, user);
    });
  });

  return app;
}
