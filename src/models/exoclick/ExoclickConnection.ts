import {
  NetworkConnection,
  Campaign,
  HttpInstance,
  IHttpConfig,
  IHttpResponse,
  Account
} from '@atsorganization/ats-lib-ntwk-common';
import ExoclickCampaign from './ExoclickCampaign';
import ExcoclickAccount from './ExoclickAccount';
import { Logger } from '@atsorganization/ats-lib-logger';

export default class ExoclickConnection extends NetworkConnection {
  /**
   * Авторизация
   * @returns
   */
  protected async auth(): Promise<void> {
    const data = { api_token: this.network.api_key };
    const response: any = await HttpInstance.request({
      url: this.network.base_url_api + 'login',
      method: 'POST',
      baseUrl: this.network.base_url_api,
      headers: { 'Content-Type': 'application/json' },
      data
    });
    const token = response.data.token;
    new Logger({ token }).setNetwork(this.network.name).setTag('token update in auth exoclick').log();
    return token;
  }

  /**
   * Инициализация коллекций
   */
  protected async initColletions(): Promise<void> {
    if (this.network.collections && this.api_conn) {
      this.network.collections.countries = await this.api_conn
        ?.get('collections/countries?limit=10000')
        .then((r: IHttpResponse) => r.data.result);
      this.network.collections.timezones = await this.api_conn
        ?.get('collections/timezones')
        .then((r: IHttpResponse) => r.data.result);
    }
  }

  /**
   * Открытие соединения
   * @returns
   */
  async open(): Promise<NetworkConnection> {
    const token = await this.auth();
    // устанока соединения через АПИ
    this.api_conn = new HttpInstance({
      baseUrl: this.network?.base_url_api,
      headers: {
        Authorization: 'Bearer ' + `${token}`
      }
    });
    this.keepAlive();
    await this.initColletions();
    return this;
  }

  getCampaign(): Campaign {
    return new ExoclickCampaign(this);
  }

  getAccount(): Account {
    return new ExcoclickAccount(this);
  }

  /**
   * Поддержание соежинения в живых
   */
  keepAlive(): void {
    const callback = async (response: { config: IHttpConfig; status?: number }): Promise<any> => {
      // if (response.status === 401 && response.config && !response.config.__isRetryRequest) {
      //   return await this.open().then(async (conn: NetworkConnection) => {
      //     response.config.__isRetryRequest = true;
      //     return HttpInstance.request?.(response.config);
      //   });
      // }
      // return response;
    };

    this.admin_conn?.keepAlive(callback);
  }
}
