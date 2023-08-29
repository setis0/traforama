import ExoclickConnection from './AdxAdConnection';
import { ICollectionsNetwork, Network, NetworkConnection } from '@atsorganization/ats-lib-ntwk-common';
import AdxAdConnection from './AdxAdConnection';

// interface ICollectionsExoclick extends ICollectionsNetwork {
//   countries: IResultFullDataCampaignCountryItem[];
//   timezones: IResultFullDataCampaignTimezoneItem[];
// }
export default class AdxAd extends Network {
  // collections?: ICollectionsExoclick;
  constructor(login: string, password: string, api_key: string) {
    super(login, password, api_key);
    this.base_url_api = 'https://td.adxad.com/adv/v1/';
    this.base_url_admin = 'https://td.adxad.com/adv/v1/';
    this.name = 'adxad';
    // this.collections = { countries: [], timezones: [] };
  }
  async createConnection(): Promise<NetworkConnection> {
    return await new AdxAdConnection(this).open();
  }
}
