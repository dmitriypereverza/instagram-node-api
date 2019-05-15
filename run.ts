import botBuild from "./src/botBuilder";

const config = require('./config.json');

const bot = botBuild(config);
bot.start();
