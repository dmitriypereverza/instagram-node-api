import { ActionMakerInterface, ActionMakerConfig } from "./index";
import Instagram from "../lib/instagram";
import { ActionInterface } from "../actions/buildAction";

export interface UserInterface {
  id: string,
  username: string,
}
export interface TransactionBundleInterface {
  user: UserInterface,
  posts: any[],
}

export default class DefaultActionMaker implements ActionMakerInterface {
  private config;
  private actions: ActionInterface[];
  private client: Instagram;

  constructor(config: ActionMakerConfig, actions: ActionInterface[], client) {
    this.actions = actions;
    this.config = config;
    this.client = client;
  }

  async runActions(user: UserInterface) {
    console.log('Action Maker', user.id);

    const transactionBundle = await this.buildTransactionBundle(user.id);

    console.log(`Get user ${transactionBundle.user.username}`);

    for (const asyncAction of this.actions) {
      await asyncAction.run(transactionBundle, this.client)
    }

    return;
  };

  private async buildTransactionBundle (userId: string): Promise<TransactionBundleInterface> {
    let { user: { edge_owner_to_timeline_media: { edges: posts } } } = await this.client.getUserIdPhotos(userId);
    posts = posts.map(photo => photo.node);

    const { owner } = await this.client.getMediaByShortcode(posts[0].shortcode);
    return { user: owner, posts };
  }
}
