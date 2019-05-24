import { UserSourceByTypeConfig, UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";
import { EventEmitter2 } from "eventemitter2";

export default class FollowersSource extends EventEmitter2 implements UserSourceInterface {
  private readonly config: UserSourceByTypeConfig;
  private client: Instagram;
  private userList: any[] = [];
  private readonly originalUserList: any[] = [];
  private instagramUserList: any[] = [];

  constructor(config: UserSourceByTypeConfig, tagList: string[]) {
    super();
    this.originalUserList = tagList;
    this.config = config;

    this.userList = this.originalUserList.slice();
  }

  async getNext(client: Instagram) {
    this.client = client;
    const user = await this.getNextUser() as any;
    if (!user) {
      return;
    }

    const follower = await this.client.getUserByUsername(user.username);

    this.emit('log', `Получили подписчика ${follower.username}`);
    return follower;
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
    this.emit('log', `Получаем подписчиков пользователя ${user}`);

    user = await this.client.getUserByUsername(user);
    let followers = await this.client.getFollowers(user.id, this.config.getPerOnce || 20);
    if (this.config.getPerOnce) {
      followers = followers.slice(0, this.config.getPerOnce);
    }

    return followers;
  }
}
