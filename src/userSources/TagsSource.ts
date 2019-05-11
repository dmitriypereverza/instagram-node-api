import { UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";

export interface UserSourceByTypeConfig {
  type: "list" | "file",
  data: any,
  isCircle: boolean
}

export default class TagsSource implements UserSourceInterface {
  private readonly config: UserSourceByTypeConfig;
  private client: Instagram;
  private tagList: any[] = [];
  private readonly originalTagList: any[] = [];
  private instagramTagList: any[] = [];

  constructor(config: UserSourceByTypeConfig, tagList: string[], client: Instagram) {
    this.originalTagList = tagList;
    this.config = config;
    this.client = client;

    this.tagList = this.originalTagList;
  }

  async getNext() {
    const tag = await this.getNextTag() as any;
    if (!tag) {
      console.log('Тег не найден');
      return;
    }
    const mediaPost = await this.client.getMediaByShortcode(tag.shortcode);
    return mediaPost.owner;
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
        this.tagList = this.originalTagList;
      } else {
        return [];
      }
    }
    const tag = this.tagList.shift();
    let { edge_hashtag_to_media: { edges } } = await this.client.getMediaFeedByHashtag(tag);
    return edges.map(tag => tag.node);
  }
}
