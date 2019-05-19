import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

interface WaitRangeConfigInterface {
  from: number
  to: number
}

export default class WaitRange extends EventEmitter2 implements ActionInterface {
  private config: WaitRangeConfigInterface;

  constructor(config: WaitRangeConfigInterface) {
    super();
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(resolve => {
      const time = this.getDelaySeconds();
      this.emit('log', `Сгенерировано врямя ожидания. Ждем ${time} секунд`);
      setTimeout(function () {
        resolve();
      }, time * 1000);
    });
  }

  private getDelaySeconds (): number {
    return this.config.from + Math.round(Math.random() * this.config.to - this.config.from);
  }
}

