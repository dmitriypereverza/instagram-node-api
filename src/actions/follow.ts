import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

export default class Follow extends EventEmitter2 implements ActionInterface {
  constructor(config) {
    super();
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(async (resolve, reject) => {
      const [ [ canFollow ] ] = await this.emitAsync('canFollow');
      if (!canFollow) {
        reject({
          code: 'limitExpired',
          by: 'follow',
          message: 'Досигнут лимит подписок.',
        });
      }

      try {
        this.emit('log', `Подписываемся на [${transactionBundle.user.username}]`);
        const userId = transactionBundle.user.id;
        await client.follow(userId);
        this.emit('action.follow', userId);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

