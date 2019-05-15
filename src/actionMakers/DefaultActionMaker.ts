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
  private readonly actions: ActionInterface[];
  private client: Instagram;

  constructor(config: ActionMakerConfig, actions: ActionInterface[]) {
    this.actions = actions;
  }

  async runActions(user: UserInterface, client: Instagram) {
    this.client = client;
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
