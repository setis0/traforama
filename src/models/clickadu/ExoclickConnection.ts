import axios from 'axios';
import RuCaptcha from '../../services/RuCaptcha';
import { RU_CAPTCHA_KEY } from '../../consts';
import ExoclickAccount from './ExoclickAccount';
import ExoclickCampaign from './ExoclickCampaign';
import {
  NetworkConnection,
  Campaign,
  HttpInstance,
  IHttpConfig,
  IHttpResponse,
  Account
} from '@atsorganization/ats-lib-ntwk-common';
import Exoclick from './Exoclick';

export default class ExoclickConnection extends NetworkConnection {
  /**
   * Авторизация в сети
   * @returns
   */
  private async auth(): Promise<string | false> {
    const url = `${this.network?.base_url_admin}login`;
    const responseToken = await axios
      .post(url, '{"api_token":"' + this.network.api_key + '"}', {
        validateStatus: (status) => [200, 401, 302, 405].includes(status),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((resp: IHttpResponse) => resp.data);
    return responseToken.token;
  }

  private solveReCapathca = async (site_id: any, site_url: any): Promise<any> => {
    const ruCaptcha = new RuCaptcha(RU_CAPTCHA_KEY);
    const id_res_solve_recaptcha = await ruCaptcha.sendReCaptcha(site_id, site_url);
    const result_captcha = await ruCaptcha.result(id_res_solve_recaptcha);
    console.log('result_captcha', id_res_solve_recaptcha, result_captcha);
    return result_captcha;
  };

  /**
   * Открытие соединения
   * @returns
   */
  async open(): Promise<NetworkConnection> {
    //устанока соединения через АПИ
    this.api_conn = new HttpInstance({
      baseUrl: this.network?.base_url_api,
      headers: {
        Authorization: `${this.network?.api_key}`
      }
    });
    //устанока соединения через админку
    const bearer_token = await this.auth();
    this.admin_conn = new HttpInstance({
      baseUrl: this.network?.base_url_admin,
      headers: {
        Authorization: `Bearer ${bearer_token}`
      }
    });

    this.keepAlive();
    return this;
  }

  getCampaign(): Campaign {
    return new ExoclickCampaign(this);
  }

  getAccount(): Account {
    return new ExoclickAccount(this);
  }

  /**
   * Поддержание соежинения в живых
   */
  keepAlive(): void {
    const callback = async (response: { config: IHttpConfig; status?: number }): Promise<any> => {
      if (response.status === 401 && response.config && !response.config.__isRetryRequest) {
        return await this.open().then(async (conn: NetworkConnection) => {
          response.config.__isRetryRequest = true;
          return HttpInstance.request?.(response.config);
        });
      }

      return response;
    };

    this.admin_conn?.keepAlive(callback);
  }
}
