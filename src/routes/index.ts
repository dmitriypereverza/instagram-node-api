import { Router } from "express";

import buildPassword from "../helpers/buildPassword";

import * as accountController from "../controllers/account";
import * as botController from "../controllers/bot";
import * as homeController from "../controllers/home";
import * as userController from "../controllers/user";
import * as strategyController from "../controllers/strategy";

import { authMiddleware } from "../middleware/auth";

export default function buildRoutes(app) {
  app = buildPassword(app);

  app.use('/account', authMiddleware, Router()
    .get('/:id', accountController.get)
    .get('/list', accountController.list)
    .post('/:id', accountController.update)
    .put('/', accountController.add)
    .delete('/:id', accountController.remove)
  );
  app.use('/strategy', authMiddleware, Router()
    .get('/:id', strategyController.get)
    .get('/list', strategyController.list)
    .post('/:id', strategyController.update)
    .put('/', strategyController.add)
    .delete('/:id', strategyController.remove)
  );
  app.use('/bot', authMiddleware, Router()
    .get('/:id', botController.get)
    .get('/list', botController.list)
    .post('/:id', botController.update)
    .put('/', botController.add)
    .delete('/:id', botController.remove)
    .get('/targets', botController.targets)
    .get('/actions', botController.actions)
  );
  app.use('/user', Router()
    .post('/register', userController.register)
    .post('/login', userController.login)
    .get('/logout', userController.logout)
  );
  app.use('/', authMiddleware, Router()
    .get('/', homeController.index)
  );

  app.use(function(err, req, res, next) {
    if (!err) {
      const err = new Error('Not Found');
      // @ts-ignore
      err.status = 404;
    }
    res.status(err.status || 500);
    res.json({
      status: err.status,
      message: err.message
    });
  });

  return app;
}

