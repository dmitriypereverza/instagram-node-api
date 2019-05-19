import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";
import { EventEmitter2 } from "eventemitter2";

interface CommentConfigInterface {
  text: string,
  postNumber: number,
}

export default class Comment extends EventEmitter2 implements ActionInterface {
  private config: CommentConfigInterface;

  constructor(config: CommentConfigInterface) {
    super();
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(async (resolve, reject) => {
      const [ [ canComment] ] = await this.emitAsync('canComment');
      if (!canComment) {
        reject({
          code: 'limitExpired',
          by: 'comment',
          message: 'Досигнут лимит комментариев.',
        });
      }

      const post = transactionBundle.posts[this.config.postNumber - 1];
      try {
        this.emit('log', `Пишем комментарий ${this.config.text}`);
        await client.addComment(post.id, this.config.text);
        this.emit('action.comment', post.id);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }


}

