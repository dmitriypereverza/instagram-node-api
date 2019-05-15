import { UserSourceByTypeConfig, UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";
import { EventEmitter2 } from "eventemitter2";

export default class ListSource extends EventEmitter2 implements UserSourceInterface {
  private readonly config: UserSourceByTypeConfig;
  private readonly originalUserNameList: string[] = [];
  private userNameList: string[] = [];
  private cachedUserList: any[] = [];

  constructor(config: UserSourceByTypeConfig, userList: string[]) {
    super();
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

    this.emit('log', `Получили подписчика из списка ${user.username}`);
    return user;
  }
}
