import botBuild from "./src/botBuilder";
import logger from "./src/logger";

const config = require('./config.json');

const bot = botBuild(config, 'wwhfz', 'traditional');

bot.on('error.ban', text => {
  logger.error(`Бот говорит что дела плохо. ${text}`);
});

bot.on('log.*', function (text) {
  logger.debug(`Бот говорит. ${text}`);
});

bot.start();
