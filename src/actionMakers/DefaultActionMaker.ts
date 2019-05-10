import { ActionMakerInterface, ActionMakerConfig } from "./index";

export default class DefaultActionMaker implements ActionMakerInterface {
  private config;

  constructor(config: ActionMakerConfig) {
    this.config = config;
  }

  runActions(user: any) {
    console.log('actionMaker');
    return;
  };
}
