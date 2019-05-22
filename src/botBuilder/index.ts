import Bot from "./bot";
import Instagram from "../lib/instagram";
import makeHummableRequestProxy from "../lib/HumanableRequests";
import makeUserSource, { UserSourceConfig } from "../userSources";
import makeActionMaker, { ActionMakerConfig } from "../actionMakers";
import Scheduler, { ScheduleConfig } from "../scheduler";
import db from "../db";

export interface StrategyConfig {
  schedule: ScheduleConfig,
  userSource: UserSourceConfig,
  actions: ActionMakerConfig
}

interface LimitInterface {
  value: number,
  hours: number
}

export interface GeneralConfigInterface {
  limits: {
    like: LimitInterface
    follow: LimitInterface
    unfollow: LimitInterface
    comment: LimitInterface
  }
}

export interface BotConfig {
  general: GeneralConfigInterface
  accounts: { [name: string]: { username: string, password: string }}
  strategies: { [name: string]: StrategyConfig }
}

function botBuild(config: BotConfig, accountCode: string, strategy: string): Bot {
  const { username, password } = config.accounts[accountCode];
  const client = new Instagram({ username, password, cookieStorePath: './store/cookies.json' });
  const instagramClient = makeHummableRequestProxy(client, 9) as Instagram;

  if (!config.strategies.hasOwnProperty(strategy)) {
    throw new Error(`Стратегия не найдена в конфинурационный файл не найден. ${strategy}`);
  }
  const strategyConfig = config.strategies[strategy];

  const userSource = makeUserSource(strategyConfig.userSource);
  const actionMaker = makeActionMaker(strategyConfig.actions);
  const scheduler = new Scheduler(strategyConfig.schedule);

  return new Bot(config.general, instagramClient, db, scheduler, userSource, actionMaker);
}

export default botBuild;
