import {
  NetworkConnection,
  Campaign,
  HttpInstance,
  IHttpConfig,
  IHttpResponse,
  Account,
  SetCookies,
  HTML
} from '@atsorganization/ats-lib-ntwk-common';
import ExoclickCampaign from './TrendingBidCampaign';
import ExcoclickAccount from './TrendingBidAccount';
import ModelSiteIdCaptcha from './api/ModelSiteIdCaptcha';

import { Logger } from '@atsorganization/ats-lib-logger';
import { IResultFullDataCampaignCountryItem } from './TradingBid';
import RuCaptcha from '../../services/RuCaptcha';
import { RU_CAPTCHA_KEY } from '../../consts';
const qs = require('qs'); // Импортируйте библиотеку qs

export default class TrendingBidConnection extends NetworkConnection {
  /**
   * Инициализация коллекций
   */
  protected async initColletions(): Promise<void> {
    const externalUrlGetALlCountries = 'https://restcountries.com/v3.1/all';
    const externalUrlCountries = 'api/autocomplete/searchcountries/search/';
    if (this.network.collections && this.admin_conn) {
      const allCountries = await HttpInstance.request({
        url: externalUrlGetALlCountries,
        method: 'GET'
      }).then((d: IHttpResponse) => d.data);

      this.network.collections.countries = await this.admin_conn?.get(externalUrlCountries).then((r: IHttpResponse) => {
        // console.log(111, r);
        return r.data.data.map((m: IResultFullDataCampaignCountryItem) => {
          return {
            ...m,
            code: allCountries.find((f: any) => f.name.common.toLowerCase() === m.titleEn.toLowerCase())?.cca2
          };
        });
      });
    }
  }

  private solveReCapathca = async (site_id: any, site_url: any): Promise<any> => {
    const ruCaptcha = new RuCaptcha(RU_CAPTCHA_KEY);
    const id_res_solve_recaptcha = await ruCaptcha.sendReCaptcha(site_id, site_url);
    const result_captcha = await ruCaptcha.result(id_res_solve_recaptcha);
    console.log('result_captcha', id_res_solve_recaptcha, result_captcha);
    return result_captcha;
  };

  private mutationAttrSiteKey(data: string): string {
    return data.replace('data-sitekey', 'datasitekey');
  }

  /**
   * Авторизация в сети
   * @returns
   */
  private async auth(): Promise<string | false> {
    const dataAuth: any = {
      username: this.network.login,
      password: this.network.password
    };
    const externalUrl = 'login';
    const url = `${this.network.base_url_admin}${externalUrl}`;
    let modelSiteIdCaptcha: ModelSiteIdCaptcha = {
      isCaptcha: '.g-recaptcha (datasitekey)'
    };
    const loginPage = await HttpInstance.request({
      url,
      method: 'GET',
      baseUrl: this.network.base_url_admin
    }).then((d: any) => d);
    const isCaptcha = HTML.parse(this.mutationAttrSiteKey(loginPage.data), modelSiteIdCaptcha)?.['isCaptcha'];
    const { PHPSESSID: PHPSESSID_LOGIN } = SetCookies.parse(loginPage.headers?.['set-cookie']);
    console.log('isCaptcha', isCaptcha, 'PHPSESSID', PHPSESSID_LOGIN);
    if (isCaptcha) {
      const g_response_recaptcha = await this.solveReCapathca(isCaptcha, this.network.base_url_admin + externalUrl);
      // console.log('g_response_recaptcha', g_response_recaptcha);
      dataAuth['g-recaptcha-response'] = g_response_recaptcha;
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: 'PHPSESSID=' + PHPSESSID_LOGIN.value,
      Referer: 'https://trending.bid/login',
      Origin: 'https://trending.bid'
    };
    const response: any = await HttpInstance.request({
      url,
      method: 'POST',
      baseUrl: this.network.base_url_admin,
      headers,
      data: qs.stringify(dataAuth),
      maxRedirects: 0,
      validateStatus: (status: any) => status === 200 || status === 302
    } as any);
    // console.log(response.headers, response.status);
    const { PHPSESSID, auth } = SetCookies.parse(response.headers?.['set-cookie']);
    return `PHPSESSID=${PHPSESSID?.value ?? PHPSESSID_LOGIN.value};auth=${auth?.value ?? ''}`;
  }
  /**
   * Открытие соединения
   * @returns
   */
  async open(): Promise<NetworkConnection> {
    //устанока соединения через админку
    const authcookies = await this.auth();
    console.log(authcookies);
    // устанока соединения через АПИ
    this.api_conn = new HttpInstance({
      baseUrl: this.network?.base_url_api,
      headers: {}
    });
    this.admin_conn = new HttpInstance({
      baseUrl: this.network?.base_url_admin,
      headers: { Cookie: authcookies }
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
      return response;
    };

    // api conn
    const callbacErrkApi = async (response: { config: IHttpConfig; status?: number }): Promise<any> => {
      return response;
    };
    const callbackRequestAdmin = async (config: IHttpConfig) => {
      return config;
    };

    this.api_conn?.keepAlive(async () => {}, callbacErrkApi);
    this.admin_conn?.keepAlive(callbackRequestAdmin, callbackErrAdmin);
  }
}
