import { UserSourceByTypeConfig, UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";

export default class TagsSource implements UserSourceInterface {
  private readonly config: UserSourceByTypeConfig;
  private tagList: any[] = [];
  private readonly originalTagList: any[] = [];
  private instagramTagList: any[] = [];
  private client: Instagram;

  constructor(config: UserSourceByTypeConfig, tagList: string[]) {
    this.originalTagList = tagList;
    this.config = config;

    this.tagList = this.originalTagList.slice();
  }

  async getNext(client: Instagram) {
    this.client = client;
    const tag = await this.getNextTag() as any;
    if (!tag) {
      return;
    }
    return tag.owner;
  };

  private async getNextTag() {
    if (!this.instagramTagList.length) {
      this.instagramTagList = await this.takeNewTagsFeed() as any[];
    }
    return this.instagramTagList.shift();
  }

  private async takeNewTagsFeed () {
    if (!this.tagList.length) {
      if (this.config.isCircle) {
        this.tagList = this.originalTagList.slice();
      } else {
        return [];
      }
    }
    const tag = this.tagList.shift();
    let tags = await this.client.getMediaFeedByHashtag(tag);

    if (this.config.getPerOnce) {
      tags = tags.slice(0, this.config.getPerOnce);
    }

    return tags;
  }
}
