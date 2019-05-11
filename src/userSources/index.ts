import TagsSource from "./TagsSource";
import * as fs from "fs";

export interface UserSourceInterface {
  getNext: () => any
}

export interface UserSourceConfig {
  type: string,
  source: any,
}

export default function makeUserSource(config: UserSourceConfig, client): UserSourceInterface {
  const dataForUserSource = getSourceByType(config.source);

  switch (config.type) {
    case "hashTag":
      return new TagsSource(dataForUserSource, dataForUserSource, client);
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

function getSourceByType (config) {
  switch (config.type) {
    case "list":
      return config.data;
    case "file":
      const fileText = fs.readFileSync(config.data).toString();
      return fileText.split('\n').map(item => item.trim());
    default:
      throw new Error('Передан неизвестный тип источника пользователей.');
  }
}
