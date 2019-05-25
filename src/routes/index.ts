import accountRoute from "./account";
import botRoute from "./bot";
import userRoute from "./user";
import home from "./home";

import { mustAuthenticatedMw } from "../middleware/auth";
import buildPassword from "../helpers/buildPassword";

export default function buildRoutes(app) {
  app = buildPassword(app);

  app.use('/account', mustAuthenticatedMw, accountRoute);
  app.use('/bot', botRoute);
  app.use('/user', userRoute);
  app.use('/', home);

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

