import botBuild from "./src/botBuilder";

const config = require('./config.json');

const bot = botBuild(config, 'traditional');

bot.on('error.ban', text => {
  console.log(`Бот говорит что дела плохо. ${text}`);
});

bot.on('log.*', function (text) {
  console.log(`Бот говорит. ${text}`);
});

bot.start();
