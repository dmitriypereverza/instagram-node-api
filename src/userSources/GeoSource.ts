import { UserSourceByTypeConfig, UserSourceInterface } from "./index";
import Instagram from "../lib/instagram";

export default class GeoSource implements UserSourceInterface {
  private readonly config: UserSourceByTypeConfig;
  private client: Instagram;
  private geoList: any[] = [];
  private readonly originalGeoList: any[] = [];
  private instagramGeoList: any[] = [];

  constructor(config: UserSourceByTypeConfig, tagList: string[], client: Instagram) {
    this.originalGeoList = tagList;
    this.config = config;
    this.client = client;

    this.geoList = this.originalGeoList.slice();
  }

  async getNext() {
    const tag = await this.getNextTag() as any;
    if (!tag) {
      return;
    }
    return tag.owner;
  };

  private async getNextTag() {
    if (!this.instagramGeoList.length) {
      this.instagramGeoList = await this.takeNewGeoFeed() as any[];
    }
    return this.instagramGeoList.shift();
  }

  private async takeNewGeoFeed () {
    if (!this.geoList.length) {

      if (this.config.isCircle) {
        this.geoList = this.originalGeoList.slice();
      } else {
        return [];
      }
    }
    const geo = this.geoList.shift();

    let geos = await this.client.getMediaFeedByLocation(geo);

    if (this.config.getPerOnce) {
      geos = geos.slice(0, this.config.getPerOnce);
    }

    return geos;
  }
}
