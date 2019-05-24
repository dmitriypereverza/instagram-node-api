import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

export default class Unfollow extends EventEmitter2 implements ActionInterface {
  constructor(config) {
    super();
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(async (resolve, reject) => {
      const [ [ canFollow ] ] = await this.emitAsync('canUnfollow');
      if (!canFollow) {
        reject({
          code: 'limitExpired',
          by: 'unfollow',
          message: 'Досигнут лимит отписок.',
        });
      }

      try {
        this.emit('log', `Отписываемся от [${transactionBundle.user.username}]`);
        const userId = transactionBundle.user.id;
        await client.unfollow(userId);
        this.emit('action.unfollow', userId);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

