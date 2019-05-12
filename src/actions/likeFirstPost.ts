import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";

export default class LikeFirstPost implements ActionInterface {
  constructor(config) {}

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      client.like(transactionBundle.posts[0].id)
        .then(() => {
          console.log('LikeFirstPost!!!');
          resolve()
        });
    });
  }
}

