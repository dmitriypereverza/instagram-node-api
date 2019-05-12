import { ActionInterface } from "./buildAction";
import Instagram from "../lib/instagram";
import { TransactionBundleInterface } from "../actionMakers/DefaultActionMaker";

interface CommentConfigInterface {
  text: string,
  postNumber: number,
}

export default class Comment implements ActionInterface {
  private config: CommentConfigInterface;

  constructor(config: CommentConfigInterface) {
    this.config = config;
  }

  run(transactionBundle: TransactionBundleInterface, client: Instagram) {
    return new Promise(async resolve => {

      console.log("Add comment!!!");
      const post = transactionBundle.posts[this.config.postNumber - 1];
      await client.addComment(post.id, this.config.text);

      resolve();

    });
  }


}

