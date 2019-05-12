import DefaultActionMaker from "./defaultActionMaker";
import buildActions from "../actions/buildAction";

export interface ActionMakerInterface {
  runActions: (user: any) => void
}

export interface ActionMakerConfig {
  items: any[],
}

export default function makeActionMaker(config: ActionMakerConfig, client) {

  const actions = config.items.map(action => buildActions(action));

  return new DefaultActionMaker(config, actions, client);
};
