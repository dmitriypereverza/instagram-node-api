import Bot from "./bot";
import makeUserSource, { UserSourceConfig } from "../userSources";
import makeActionMaker, { ActionMakerConfig } from "../actionMakers";
import Scheduler, { ScheduleConfig } from "../scheduler";

interface StrategyConfig {
  schedule: ScheduleConfig,
  userSource: UserSourceConfig,
  actions: ActionMakerConfig
}

function botBuild(strategy: string) {
  const config = require('../../config.json');
  const strategyConfig = config.strategies[strategy] as StrategyConfig;

  if (!strategyConfig) {
    throw new Error('Стратегия работы бота не найдена');
  }

  const userSource = makeUserSource(strategyConfig.userSource);
  const actionMaker = makeActionMaker(strategyConfig.actions);
  const scheduler = new Scheduler(strategyConfig.schedule);

  return new Bot(scheduler, userSource, actionMaker);
}

export default botBuild;
