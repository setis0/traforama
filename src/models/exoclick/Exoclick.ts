import ExoclickConnection from './ExoclickConnection';
import { ICollectionsNetwork, Network, NetworkConnection } from '@atsorganization/ats-lib-ntwk-common';
import { IResultFullDataCampaignCountryItem, IResultFullDataCampaignTimezoneItem } from './api/FullDataCampaign';

interface ICollectionsExoclick extends ICollectionsNetwork {
  countries: IResultFullDataCampaignCountryItem[];
  timezones: IResultFullDataCampaignTimezoneItem[];
}
export default class Exoclick extends Network {
  collections?: ICollectionsExoclick;
  constructor(login: string, password: string, api_key: string) {
    super(login, password, api_key);
    this.base_url_api = 'https://api.exoclick.com/v2/';
    this.base_url_admin = 'https://api.exoclick.com/v2/';
    this.name = 'exoc{lick';
    this.collections = { countries: [], timezones: [] };
  }
  async createConnection(): Promise<NetworkConnection> {
    return await new ExoclickConnection(this).open();
  }
}
