import * as fs from "fs";
import TagsSource from "./TagsSource";
import ListSource from "./ListSource";
import GeoSource from "./GeoSource";
import FollowersSource from "./FollowersSource";
import FilteredUserSource from "./filters";
import Instagram from "../lib/instagram";

export interface UserSourceInterface {
  getNext: (instagramClient?: Instagram) => any,
  on: (type, callback) => void,
  onAny?: (callback) => void,
}

export interface UserSourceConfig {
  type: string,
  source: any,
  filters: any[],
}

export interface UserSourceByTypeConfig {
  type: "list" | "file",
  data: any,
  isCircle: boolean,
  getPerOnce: number,
}

export default function makeUserSource(config: UserSourceConfig): UserSourceInterface {
  const dataForUserSource = getSourceByType(config.source);
  const userSource = buildUserSource(config, dataForUserSource);

  return new FilteredUserSource(userSource, config.filters);
};

function buildUserSource (config, dataForUserSource) {
  switch (config.type) {
    case "list":
      return new ListSource(config.source, dataForUserSource);
    case "hashTag":
      return new TagsSource(config.source, dataForUserSource);
    case "geo":
      return new GeoSource(config.source, dataForUserSource);
    case "followers":
      return new FollowersSource(config.source, dataForUserSource);
    default:
      throw new Error('Передан неизветный тип пользовательского источника');
  }
}

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
