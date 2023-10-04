import { ICollectionsNetwork, Network, NetworkConnection } from '@atsorganization/ats-lib-ntwk-common';
import TrendingBidConnection from './TrendingBidConnection';
import RedisCache from '@atsorganization/ats-lib-redis';

export interface IResultFullDataCampaignCountryItem {
  value: string;
  label: string;
  titleEn: string;
  code?: string;
}
interface ICollectionsTrendingBid extends ICollectionsNetwork {
  countries: IResultFullDataCampaignCountryItem[];
}
export default class TrendingBid extends Network {
  collections?: ICollectionsTrendingBid;
  constructor(login: string, password: string, api_key: string, redisCache: RedisCache = new RedisCache()) {
    super(login, password, api_key, redisCache);
    this.base_url_api = 'https://trending.bid/';
    this.base_url_admin = 'https://trending.bid/';
    this.name = 'trendingbid';
    this.collections = { countries: [] };
  }
  async createConnection(): Promise<NetworkConnection> {
    return await new TrendingBidConnection(this).open();
  }
}
