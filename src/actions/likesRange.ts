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
    return new Promise(async resolve => {
      console.log('LikesRange!!!!');

      const rangeList = this.getRangeList(this.config.from, this.config.to);

      for (let i = 0; i < this.config.count; i++) {
        const randomElementNumber = Math.round(Math.random() * rangeList.length);

        await client.like(transactionBundle.posts[rangeList[randomElementNumber]].id);
        console.log(`Like ${rangeList[randomElementNumber]}`);

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

