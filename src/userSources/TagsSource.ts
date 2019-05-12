import { UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";

export interface UserSourceByTypeConfig {
  type: "list" | "file",
  data: any,
  isCircle: boolean,
  getPerOnce: number,
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

    this.tagList = this.originalTagList.slice();
  }

  async getNext() {
    const tag = await this.getNextTag() as any;
    if (!tag) {
      console.log('Тег не найден');
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

      console.log('Tag list is over');
      if (this.config.isCircle) {
        console.log('But we have is Circle!!');

        this.tagList = this.originalTagList;
      } else {
        return [];
      }
    }
    const tag = this.tagList.shift();


    console.log(`Get tags feed [${tag}]`);
    let { edge_hashtag_to_media: { edges: tags } } = await this.client.getMediaFeedByHashtag(tag);
    tags = tags.map(tag => tag.node);

    if (this.config.getPerOnce) {
      tags = tags.slice(0, this.config.getPerOnce);
    }

    return tags;
  }
}
