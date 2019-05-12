import { UserSourceByTypeConfig, UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";

export default class ListSource implements UserSourceInterface {
  private readonly config: UserSourceByTypeConfig;
  private client: Instagram;
  private readonly originalUserNameList: string[] = [];
  private userNameList: string[] = [];
  private cachedUserList: any[] = [];

  constructor(config: UserSourceByTypeConfig, userList: string[], client: Instagram) {
    this.originalUserNameList = userList;
    this.config = config;
    this.client = client;

    this.userNameList = this.originalUserNameList;
  }

  async getNext() {
    if (!this.userNameList.length) {
      if (this.config.isCircle) {
        this.userNameList = this.originalUserNameList;
      } else {
        return;
      }
    }

    const userName = this.userNameList.shift();

    let user = this.cachedUserList[userName];
    if (!user) {
      user = await this.client.getUserByUsername(userName);
      this.cachedUserList[userName] = user;
    }

    return user;
  }
}
