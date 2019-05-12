import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";

interface LikeByIndexInterface {
  index: number
}

export default class LikeByIndex implements ActionInterface {
  private config: LikeByIndexInterface;

  constructor(config: LikeByIndexInterface) {
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      client.like(transactionBundle.posts[this.config.index - 1].id)
        .then(() => {
          console.log('LikeByIndex!!!');
          resolve()
        });
    });
  }
}

