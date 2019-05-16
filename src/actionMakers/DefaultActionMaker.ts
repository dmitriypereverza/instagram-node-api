import { ActionMakerInterface, ActionMakerConfig } from "./index";
import Instagram from "../lib/instagram";
import { ActionInterface } from "../actions/buildAction";
import { EventEmitter2 } from "eventemitter2";

export interface UserInterface {
  id: string,
  username: string,
}
export interface TransactionBundleInterface {
  user: UserInterface,
  posts: any[],
}

export default class DefaultActionMaker extends EventEmitter2 implements ActionMakerInterface {
  private readonly actions: ActionInterface[];
  private client: Instagram;

  constructor(config: ActionMakerConfig, actions: ActionInterface[]) {
    super();
    this.actions = actions;
  }

  async runActions(user: UserInterface, client: Instagram) {
    this.client = client;
    const transactionBundle = await this.buildTransactionBundle(user);

    this.emit('log', `Начинаю выполнять действия...`);
    for (const asyncAction of this.actions) {
      await asyncAction.run(transactionBundle, this.client)
    }
    this.emit('log', `Успешно выполнил.`);
    return;
  };

  private async buildTransactionBundle (user): Promise<TransactionBundleInterface> {
    const posts = await this.client.getUserIdPhotos(user.id);
    return { user, posts };
  }
}
