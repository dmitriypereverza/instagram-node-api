require('dotenv').config();

import mongoose from "mongoose";

import api from "./src/routes";

connect();

const port = process.env.PORT || 3000;
function listen() {
  api.listen(port);
  console.log('Express app started on port ' + port);
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect(process.env.MONGODB_URL, { keepAlive: true, useNewUrlParser: true });
}

export default api;