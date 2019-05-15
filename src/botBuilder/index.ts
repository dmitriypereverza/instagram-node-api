import Bot from "./bot";
import makeUserSource, { UserSourceConfig } from "../userSources";
import makeActionMaker, { ActionMakerConfig } from "../actionMakers";
import Scheduler, { ScheduleConfig } from "../scheduler";

export interface StrategyConfig {
  schedule: ScheduleConfig,
  userSource: UserSourceConfig,
  actions: ActionMakerConfig
}

function botBuild(strategyConfig: StrategyConfig, client) {
  const userSource = makeUserSource(strategyConfig.userSource, client);
  const actionMaker = makeActionMaker(strategyConfig.actions, client);
  const scheduler = new Scheduler(strategyConfig.schedule);

  return new Bot(scheduler, userSource, actionMaker);
}

export default botBuild;
