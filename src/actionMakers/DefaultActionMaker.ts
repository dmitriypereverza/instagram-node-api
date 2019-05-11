import { ActionMakerInterface, ActionMakerConfig } from "./index";

export interface UserInterface {
  username: string,
  full_name: string,
}

export default class DefaultActionMaker implements ActionMakerInterface {
  private config;

  constructor(config: ActionMakerConfig, client) {
    this.config = config;
  }

  runActions(user: UserInterface) {
    console.log('Action Maker', user.username);
    return;
  };
}
