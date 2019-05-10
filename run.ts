require('./src/index');

import Instagram from "./src/lib/instagram";

const { username, password } = process.env;
const client = new Instagram({ username, password, cookieStorePath: './store/cookies.json' })
;(async () => {

  if (!client.isLogined()) {
    console.log(`Login ${username}...`);
    await client.login();
    console.info('Login success.');
  }


  // const bot = botBuilder.build('traditional');
  // bot.on('log', msg => {
  //   console.log(msg);
  // });

  const result = await client.getProfile();



  console.log(JSON.stringify(result))
})();
