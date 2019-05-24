import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

interface WaitConfigInterface {
  timeSeconds: number
}

export default class Wait extends EventEmitter2 implements ActionInterface {
  private config: WaitConfigInterface;

  constructor(config: WaitConfigInterface) {
    super();
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      this.emit('log', `Ждем ${this.config.timeSeconds} секунд`);
      setTimeout(function () {
        resolve();
      }, this.config.timeSeconds * 1000);
    });
  }
}

