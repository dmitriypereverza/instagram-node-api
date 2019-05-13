import botBuild from "./src/botBuilder";
import Instagram from "./src/lib/instagram";
import makeHummableRequestProxy from "./src/lib/HumanableRequests";

require('./src/index');

const { username, password } = process.env;
const client = new Instagram({ username, password, cookieStorePath: './store/cookies.json' });
const instagramClient = makeHummableRequestProxy(client, 2) as Instagram;

(async () => {
  if (! await instagramClient.isLogined()) {
    console.log(`Login ${username}...`);
    await instagramClient.login();
    console.info('Login success.');
  }

  const bot = botBuild('traditional', instagramClient);
  bot.start();
})();
