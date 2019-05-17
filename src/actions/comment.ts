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
    return new Promise(async resolve => {
      const post = transactionBundle.posts[this.config.postNumber - 1];
      await client.addComment(post.id, this.config.text);
      this.emit('log', `Написан комментарий ${this.config.text}`);

      resolve();
    });
  }


}

