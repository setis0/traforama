import ClickaduConnection from './ClickaduConnection';
import { Network, NetworkConnection } from '@atsorganization/ats-lib-ntwk-common';

export default class Clickadu extends Network {
  constructor(login: string, password: string, api_key: string) {
    super(login, password, api_key);
    this.base_url_api = 'https://ssp.clickadu.com/';
    this.base_url_admin = 'https://adv.clickadu.com/';
    this.name = 'clickadu';
  }
  async createConnection(): Promise<NetworkConnection> {
    return await new ClickaduConnection(this).open();
  }
}
