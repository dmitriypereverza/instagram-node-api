import { UserSourceByTypeConfig, UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";

export default class FollowersSource implements UserSourceInterface {
  private readonly config: UserSourceByTypeConfig;
  private client: Instagram;
  private userList: any[] = [];
  private readonly originalUserList: any[] = [];
  private instagramUserList: any[] = [];

  constructor(config: UserSourceByTypeConfig, tagList: string[], client: Instagram) {
    this.originalUserList = tagList;
    this.config = config;
    this.client = client;

    this.userList = this.originalUserList.slice();
  }

  async getNext() {
    const user = await this.getNextUser() as any;
    if (!user) {
      return;
    }
    return user;
  };

  private async getNextUser() {
    if (!this.instagramUserList.length) {
      this.instagramUserList = await this.takeNewFollowers() as any[];
    }
    return this.instagramUserList.shift();
  }

  private async takeNewFollowers () {
    if (!this.userList.length) {
      if (this.config.isCircle) {
        this.userList = this.originalUserList.slice();
      } else {
        return [];
      }
    }
    let user = this.userList.shift();
    user = await this.client.getUserByUsername(user);
    let followers = await this.client.getFollowers(user.id, this.config.getPerOnce || 20);
    if (this.config.getPerOnce) {
      followers = followers.slice(0, this.config.getPerOnce);
    }

    return followers;
  }
}
