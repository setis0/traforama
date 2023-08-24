import { Network, NetworkConnection } from '@atsorganization/ats-lib-ntwk-common';
import ExoclickConnection from './ExoclickConnection';

export default class Exoclick extends Network {
  constructor(login: string, password: string, api_key: string) {
    super(login, password, api_key);
    this.base_url_api = 'https://api.exoclick.com/v2/';
    this.base_url_admin = 'https://api.exoclick.com/v2/';
    this.name = 'exoclick';
  }
  async createConnection(): Promise<NetworkConnection> {
    return await new ExoclickConnection(this).open();
  }
}
