import TagsSource from "./TagsSource";

export interface UserSourceInterface {
  getNext: () => any
}

export interface UserSourceConfig {
  type: string,
  source: any,
}

export default function makeUserSource(config: UserSourceConfig): UserSourceInterface {
  switch (config.type) {
    case "hashTag":
      return new TagsSource(config.source);
    case "geo":
      return {} as UserSourceInterface;
    case "list":
      return {} as UserSourceInterface;
    case "file":
      return {} as UserSourceInterface;
    default:
      throw new Error('Передан неизветный тип пользовательского источника');
  }
};
