import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

interface LikesRangeConfigInterface {
  count: number,
  from: number,
  to: number
}

export default class LikesRange extends EventEmitter2 implements ActionInterface {
  private config: LikesRangeConfigInterface;

  constructor(config: LikesRangeConfigInterface) {
    super();
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(async resolve => {
      const rangeList = this.getRangeList(this.config.from, this.config.to);

      for (let i = 0; i < this.config.count; i++) {
        const randomElementNumber = Math.round(Math.random() * rangeList.length);
        this.emit('log', `Лайкнаем запись под номером [${rangeList[randomElementNumber]}]`);
        await client.like(transactionBundle.posts[rangeList[randomElementNumber] - 1].id);
        delete rangeList[randomElementNumber]
      }

      resolve();
    });
  }

  private getRangeList (from: number, to: number): number[] {
    const list = [];
    for (let i = from; i <= to; i++) {
      list.push(i);
    }
    return list;
  }
}

