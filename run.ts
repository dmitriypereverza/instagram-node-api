import botBuild from "./src/botBuilder";
import Instagram from "./src/lib/instagram";

require('./src/index');

const { username, password } = process.env;
const client = new Instagram({ username, password, cookieStorePath: './store/cookies.json' });

(async () => {

  if (!client.isLogined()) {
    console.log(`Login ${username}...`);
    await client.login();
    console.info('Login success.');
  }

  const bot = botBuild('traditional');
  bot.start();
})();
