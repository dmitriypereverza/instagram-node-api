import DefaultActionMaker from "./DefaultActionMaker";
import buildActions from "../actions/buildAction";

export interface ActionMakerInterface {
  runActions: (user: any, config) => void,
  on: (type, callback) => void
}

export interface ActionMakerConfig {
  items: any[],
}

export default function makeActionMaker(config: ActionMakerConfig) {
  const actions = config.items.map(buildActions);
  return new DefaultActionMaker(config, actions);
};
