import {
  NetworkConnection,
  Campaign,
  HttpInstance,
  IHttpConfig,
  IHttpResponse,
  Account
} from '@atsorganization/ats-lib-ntwk-common';
import ExoclickCampaign from './AdxAdCampaign';
import ExcoclickAccount from './AdxAdAccount';
import { Logger } from '@atsorganization/ats-lib-logger';

export default class AdxAdConnection extends NetworkConnection {
  /**
   * Инициализация коллекций
   */
  protected async initColletions(): Promise<void> {}

  /**
   * Открытие соединения
   * @returns
   */
  async open(): Promise<NetworkConnection> {
    // устанока соединения через АПИ
    this.api_conn = new HttpInstance({
      baseUrl: this.network?.base_url_api,
      headers: {}
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
    // admin conn
    const callbackErrAdmin = async (response: { config: IHttpConfig; status?: number }): Promise<any> => {
      // if (response.status === 401 && response.config && !response.config.__isRetryRequest) {
      //   return await this.open().then(async (conn: NetworkConnection) => {
      //     response.config.__isRetryRequest = true;
      //     return HttpInstance.request?.(response.config);
      //   });
      // }
      // return response;
    };

    // api conn
    const callbacErrkApi = async (response: { config: IHttpConfig; status?: number }): Promise<any> => {
      return response;
    };
    const callbackRequestApi = async (config: IHttpConfig) => {
      // Проверяем, есть ли уже "?" в URL
      const hasQueryString = String(config.url).includes('?');

      // Добавляем API ключ как параметр запроса
      config.url += `${hasQueryString ? '&' : '?'}apiKey=${this.network.api_key}`;
      return config;
    };

    this.api_conn?.keepAlive(callbackRequestApi, callbacErrkApi);
    this.admin_conn?.keepAlive(async () => {}, callbackErrAdmin);
  }
}
