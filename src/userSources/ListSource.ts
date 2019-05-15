import { UserSourceByTypeConfig, UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";

export default class ListSource implements UserSourceInterface {
  private readonly config: UserSourceByTypeConfig;
  private readonly originalUserNameList: string[] = [];
  private userNameList: string[] = [];
  private cachedUserList: any[] = [];

  constructor(config: UserSourceByTypeConfig, userList: string[]) {
    this.originalUserNameList = userList;
    this.config = config;

    this.userNameList = this.originalUserNameList.slice();
  }

  async getNext(client: Instagram) {
    if (!this.userNameList.length) {
      if (this.config.isCircle) {
        this.userNameList = this.originalUserNameList.slice();
      } else {
        return;
      }
    }

    const userName = this.userNameList.shift();

    let user = this.cachedUserList[userName];
    if (!user) {
      user = await client.getUserByUsername(userName);
      this.cachedUserList[userName] = user;
    }

    return user;
  }
}
