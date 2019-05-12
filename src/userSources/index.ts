import * as fs from "fs";
import TagsSource from "./TagsSource";
import ListSource from "./ListSource";

export interface UserSourceInterface {
  getNext: () => any
}

export interface UserSourceConfig {
  type: string,
  source: any,
}

export interface UserSourceByTypeConfig {
  type: "list" | "file",
  data: any,
  isCircle: boolean,
  getPerOnce: number,
}

export default function makeUserSource(config: UserSourceConfig, client): UserSourceInterface {
  const dataForUserSource = getSourceByType(config.source);

  switch (config.type) {
    case "list":
      return new ListSource(config.source, dataForUserSource, client);
    case "hashTag":
      return new TagsSource(config.source, dataForUserSource, client);
    case "geo":
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
