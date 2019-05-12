import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";

interface WaitConfigInterface {
  timeSeconds: number
}

export default class Wait implements ActionInterface {
  private config: WaitConfigInterface;

  constructor(config: WaitConfigInterface) {
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      setTimeout(function () {
        console.log('Waited!!!!');
        resolve();
      }, this.config.timeSeconds * 1000);
    });
  }
}

