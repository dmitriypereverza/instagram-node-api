import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

interface LikeByIndexInterface {
  postNumber: number
}

export default class LikeByIndex extends EventEmitter2 implements ActionInterface {
  private config: LikeByIndexInterface;

  constructor(config: LikeByIndexInterface) {
    super();
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      this.emit('log', `Лайкаем запись под номером [${this.config.postNumber}]`);
      client.like(transactionBundle.posts[this.config.postNumber - 1].id)
        .then(resolve);
    });
  }
}

