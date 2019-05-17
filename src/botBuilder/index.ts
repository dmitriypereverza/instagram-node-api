import Bot from "./bot";
import Instagram from "../lib/instagram";
import makeHummableRequestProxy from "../lib/HumanableRequests";
import makeUserSource, { UserSourceConfig } from "../userSources";
import makeActionMaker, { ActionMakerConfig } from "../actionMakers";
import Scheduler, { ScheduleConfig } from "../scheduler";

export interface StrategyConfig {
  schedule: ScheduleConfig,
  userSource: UserSourceConfig,
  actions: ActionMakerConfig
}

export interface BotConfig {
  account: { username: string, password: string }
  strategy: StrategyConfig
}

function botBuild(config: BotConfig): Bot {
  const { username, password } = config.account;
  const client = new Instagram({ username, password, cookieStorePath: './store/cookies.json' });
  const instagramClient = makeHummableRequestProxy(client, 9) as Instagram;

  const strategyConfig = config.strategy;

  const userSource = makeUserSource(strategyConfig.userSource);
  const actionMaker = makeActionMaker(strategyConfig.actions);
  const scheduler = new Scheduler(strategyConfig.schedule);

  return new Bot(instagramClient, scheduler, userSource, actionMaker);
}

export default botBuild;
