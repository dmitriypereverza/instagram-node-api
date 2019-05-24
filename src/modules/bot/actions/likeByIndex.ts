import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

interface LikeByIndexInterface {
  postNumber: number
}

export default class LikeByIndex extends EventEmitter2 implements ActionInterface {
  private config: LikeByIndexInterface;

  constructor(config: LikeByIndexInterface) {
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

      this.emit('log', `Лайкаем запись под номером [${this.config.postNumber}]`);
      try {
        const mediaId = transactionBundle.posts[this.config.postNumber - 1].id;
        await client.like(mediaId);
        this.emit('action.like', mediaId);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

