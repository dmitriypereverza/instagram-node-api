require('dotenv').config();

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession from "express-session";

import buildRoutes from "./src/routes";

let app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSession({ secret: 'fotchKeaf' }));
app = buildRoutes(app);

const port = process.env.PORT || 3000;
function listen() {
  app.listen(port);
  console.log('Express app started on port ' + port);
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect(process.env.MONGODB_URL, { keepAlive: true, useNewUrlParser: true });
}

connect();
