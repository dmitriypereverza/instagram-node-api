import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";

export default class Follow implements ActionInterface {
  constructor(config) {}

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      client.follow(transactionBundle.user.id)
        .then(() => {
          console.log('Follow!!!');

          resolve()
        });
    });
  }
}

