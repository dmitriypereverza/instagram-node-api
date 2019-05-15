import { UserSourceInterface } from "../index";
import Instagram from "../../lib/instagram";

export default class FilteredUserSource implements UserSourceInterface {
  private userSource: UserSourceInterface;
  private readonly filters: any[];

  constructor(userSource: UserSourceInterface, filters) {
    this.userSource = userSource;
    this.filters = filters;
  }

  async getNext(client: Instagram) {
    let user = await this.userSource.getNext(client);
    if (!user) {
      return;
    }

    if (!this.isValid(user)) {
      user = await this.getNext(client);
    }
    return user;
  }

  private isValid (user: any) {
    for (const filter of this.filters) {
      if (filter.length === 2 && !this.getTwoArgsFilterResult(user, filter)) {
        console.log(user.username, filter);
        return false;
      }
      if (filter.length === 3 && !this.getThreeArgsFilterResult(user, filter)) {
        console.log(user.username, filter);
        return false;
      }
    }

    return true;
  }

  private getTwoArgsFilterResult(user, filter) {
    const [propKey, boolVal] = filter;
    return (this.getTransformedProperty(user, propKey) === boolVal)
  }

  private getThreeArgsFilterResult(user, filter) {
    const [onePropKey, conditionKey, twoPropKey] = filter;

    return this.getConditionResult(
      conditionKey,
      this.getTransformedProperty(user, onePropKey),
      this.getTransformedProperty(user, twoPropKey)
    );
  }

  private getConditionResult(condKey, first, second): boolean {
    switch (condKey) {
      case 'more': return first > second;
      case 'less': return first < second;
      case 'equal': return first === second;
      default: throw new Error(`Условия с кодом ${condKey} не найдено`);
    }
  }

  private getTransformedProperty(user, propKey) {
    if (!(typeof propKey === 'string' || propKey instanceof String)) {
      return propKey;
    }
    switch (propKey) {
      case 'isBusinessAccount': return user.is_business_account;
      case 'isMyFollower': return user.followed_by_viewer;
      case 'followers': return user.edge_followed_by.count;
      case 'followings': return user.edge_follow.count;
      case 'media': return user.edge_owner_to_timeline_media.count;
      default: throw new Error(`Передан неизвестный фильтр ${propKey}`);
    }
  }
}
