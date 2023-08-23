import ClickaduCampaign from './ExoclickCampaign';
import axios from 'axios';
import RuCaptcha from '../../services/RuCaptcha';
import { RU_CAPTCHA_KEY } from '../../consts';

import ClickaduAccount from './ExoclickAccount';
import {
  NetworkConnection,
  Campaign,
  HttpInstance,
  IHttpConfig,
  IHttpResponse,
  Account
} from '@atsorganization/ats-lib-ntwk-common';

export default class ExoclickConnection extends NetworkConnection {
  /**
   * Открытие соединения
   * @returns
   */
  async open(): Promise<NetworkConnection> {
    //устанока соединения через АПИ
    this.api_conn = new HttpInstance({
      baseUrl: this.network?.base_url_api,
      headers: {
        Authorization: 'Bearer ' + `${this.network?.api_key}`
      }
    });
    this.keepAlive();
    return this;
  }

  getCampaign(): Campaign {
    return new ClickaduCampaign(this);
  }

  getAccount(): Account {
    return new ClickaduAccount(this);
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
