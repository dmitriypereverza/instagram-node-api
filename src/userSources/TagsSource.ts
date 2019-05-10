import { UserSourceInterface } from "./index";

export interface UserSourceByTypeConfig {
  type: "list" | "file",
  data: any,
  isCircle: boolean
}

export default class TagsSource implements UserSourceInterface {
  private config;

  constructor(config: UserSourceByTypeConfig) {
    this.config = config;
  }

  getNext() {
    console.log('byHashTag');

    return;
  };


}
