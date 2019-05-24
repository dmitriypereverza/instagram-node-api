import express from "express";
import accountRoute from "./account";
import botRoute from "./bot";

const app = express();
app.use('/account', accountRoute);
app.use('/bot', botRoute);

export default app;
