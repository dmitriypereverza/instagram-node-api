import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";
import { delay } from "../helpers";

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
    return new Promise(async (resolve, reject) => {
      const [ [ canLike ] ] = await this.emitAsync('canLike');
      if (!canLike) {
        reject({
          code: 'limitExpired',
          by: 'like',
          message: 'Досигнут лимит лайков.',
        });
      }

      const rangeList = this.getRangeList(this.config.from, this.config.to);

      for (let i = 0; i < this.config.count; i++) {
        const randomElementNumber = Math.abs(Math.round(Math.random() * rangeList.length - 1));

        this.emit('log', `Лайкнаем запись под номером [${rangeList[randomElementNumber]}]`);
        let mediaId = transactionBundle.posts[rangeList[randomElementNumber] - 1].id;
        await client.like(mediaId);
        this.emit('action.like', mediaId);

        rangeList.splice(randomElementNumber, 1);

        await delay(30 * 1000);
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

