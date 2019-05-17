import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

export default class Follow extends EventEmitter2 implements ActionInterface {
  constructor(config) {
    super();
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      client.follow(transactionBundle.user.id)
        .then(() => {
          this.emit('log', `Подписался на [${transactionBundle.user.username}]`);

          resolve()
        });
    });
  }
}

