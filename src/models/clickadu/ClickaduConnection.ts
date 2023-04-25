import NetworkConnection from "../NetworkConnection";
import Campaign from "../Campaign";
import ClickaduCampaign from "./ClickaduCampaign";
import ICampaign from "../ICampaign";
import IdCampaign from "../IdCampaign";
import HttpInstance from "../../http/HttpInstance";
import IHttpConfig from "../../http/IHttpConfig";
import IHttpResponse from "../../http/IHttpResponse";
import axios from "axios";
import RuCaptcha from "../../services/RuCaptcha";
import { RU_CAPTCHA_KEY } from "../../consts";
import ResponceApiNetwork from "../ResponceApiNetwork";

export default class ClickaduConnection extends NetworkConnection {

    /**
     * Авторизация в сети
     * @returns 
     */
    private async auth(): Promise<string | false> {
        const externalUrl = 'api/v1.0/login_check';
        const checkIsCapatchUrl = 'auth/login';
        const dataLogin = {
            "gRecaptchaResponse": null,
            "password": this.network?.password,
            "type": "ROLE_ADVERTISER",
            "username": this.network?.login,
        };
        const url = `${this.network?.base_url_admin}${externalUrl}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        // console.log({ url: checkIsCapatchUrl, baseURL: this.network.base_url_admin, method: 'get' });
        // const isCaptcha = await axios({ url: checkIsCapatchUrl, baseURL: this.network.base_url_admin, method: 'get' }).then((d: any) => d.data)
        // console.log(isCaptcha);
        // return isCaptcha;
        const responseToken = await axios.post(url, dataLogin, {
            validateStatus: (status) => [200, 401, 302, 405].includes(status), headers
        }).then((resp: IHttpResponse) => resp.data);
        // const isCaptcha = false;
        // const resilt_recaptcha = await solveReCapathca(isCaptcha, baseUrl + this.loginUrl);
        // console.log(responseToken);
        return responseToken.result.accessToken;
    }

    private solveReCapathca = async (site_id: any, site_url: any): Promise<any> => {
        const ruCaptcha = new RuCaptcha(RU_CAPTCHA_KEY);
        const id_res_solve_recaptcha = await ruCaptcha.sendReCaptcha(site_id, site_url);
        const result_captcha = await ruCaptcha.result(id_res_solve_recaptcha);
        console.log('result_captcha', id_res_solve_recaptcha, result_captcha);
        return result_captcha;
    }

    /**
     * Открытие соединения
     * @returns 
     */
    async open(): Promise<NetworkConnection> {
        //устанока соединения через АПИ
        this.api_conn = new HttpInstance(({
            baseUrl: this.network?.base_url_api,
            headers: {
                Authorization: `${this.network?.api_key}`,
            }
        }))
        //устанока соединения через админку
        const bearer_token = await this.auth();
        this.admin_conn = new HttpInstance(({
            baseUrl: this.network?.base_url_admin,
            headers: {
                Authorization: `Bearer ${bearer_token}`,
            }
        }))
        this.keepAlive();
        return this;
    }

    /**
     * Создание кампании
     * @param campaign_data 
     * @returns 
     */
    async createCampaign(campaign_data: ICampaign): Promise<ResponceApiNetwork> {
        return await ClickaduCampaign.create(this, campaign_data)
    }

    /**
     * Список кампаний
     */
    listCampaigns(): Promise<Campaign> {
        throw new Error("Method not implemented.");
    }

    /**
     * Получение кампании по id
     * @param id 
     */
    async getCampaign(id: string): Promise<Campaign> {
        return await ClickaduCampaign.fetch(this, new IdCampaign(id));
    }

    /**
     * Поддержание соежинения в живых
     */
    keepAlive(): void {
        const callback = async (response: { config: IHttpConfig, status?: number, }): Promise<any> => {

            if (response.status === 401 && response.config &&
                !response.config.__isRetryRequest) {
                return await this.open().then(async (conn: NetworkConnection) => {
                    response.config.__isRetryRequest = true;
                    return HttpInstance.request?.(response.config);
                });
            }

            return response;
        }

        this.admin_conn?.keepAlive(callback);
    }

}