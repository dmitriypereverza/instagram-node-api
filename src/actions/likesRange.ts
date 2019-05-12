import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";

interface LikesRangeConfigInterface {
  count: number,
  from: number,
  to: number
}

export default class LikesRange implements ActionInterface {
  private config: LikesRangeConfigInterface;

  constructor(config: LikesRangeConfigInterface) {
    this.config = config;}

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      console.log('LikesRange!!!!');
      resolve();
    });
  }
}

