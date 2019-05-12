import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";

interface WaitRangeConfigInterface {
  from: number
  to: number
}

export default class WaitRange implements ActionInterface {
  private config: WaitRangeConfigInterface;

  constructor(config: WaitRangeConfigInterface) {
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      setTimeout(function () {
        console.log('WaitRange!!!!');
        resolve();
      }, this.getDelaySeconds() * 1000);
    });
  }

  private getDelaySeconds (): number {
    return this.config.from + Math.round(Math.random() * this.config.to - this.config.from);
  }
}

