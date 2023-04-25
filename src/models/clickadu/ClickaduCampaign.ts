import BidCampaign from "../BidCampaign";
import Campaign from "../Campaign";
import CountryCampaign from "../CountryCampaign";
import ICampaign from "../ICampaign";
import NameCampaign from "../NameCampaign";
import NetworkConnection from "../NetworkConnection";
import PlacementCampaign from "../PlacementCampaign";
import SourceIdCampaign from "../SourceIdCampaign";
import StageCampaign from "../StageCampaign";
import StatusCampaign from "../StatusCampaign";
import TargetUrlCampaign from "../TargetUrlCampaign";
import TemplateIdCampaign from "../TemplateIdCampaign";
import BrowserVersionCampaign from "../BrowserVersionCampaign";
import IdCampaign from "../IdCampaign";
import { AxiosResponse } from "axios";
import IHttpResponse from "../../http/IHttpResponse";
import ResUpdPlcmtCampaign from "../ResponceApiNetwork";
import ResultUpdatePlacementsCampaign from "../ResponceApiNetwork";
import ResponceApiNetwork from "../ResponceApiNetwork";
import { RESPONSE_CODES } from "../../consts";

export default class ClickaduCampaign extends Campaign {


    /**
     * Создание кампании
     * @param conn 
     * @param data 
     * @returns 
     */
    static async create(conn: NetworkConnection, data: ICampaign): Promise<ResponceApiNetwork> {
        const campaign = new ClickaduCampaign(conn, data);
        const { name, template_id, bid, country, placements_data, target_url } = data;

        const fullDataCampaign = await campaign.getFullDataCampaign(new IdCampaign(template_id.value));

        if (!target_url.value) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: 'Not get data from network' })
        }
        const newIdCampaign = await campaign.clone(new IdCampaign(template_id.value));
        if (!newIdCampaign) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: 'Error clone campaign in network' })
        }
        // const newId = new IdCampaign(String(newIdCampaign));
        const {
            autoLinkNewZones,
            frequency,
            capping,
            impFrequency,
            impCapping,
            rateModel,
            direction,
            evenlyLimitsUsage,
            trafficQuality,
            isAdblockBuy,
            isDSP,
            trafficBoost,
            startedAt,
            feed,
            trafficVertical,
            targeting
        } = fullDataCampaign;

        const dataFromCreateCampaign = {
            "name": name.value,
            "budgetLimit": 0,
            "rates": [
                {
                    "amount": Math.ceil(Number(bid.value) * 100) / 100,
                    "countries": [country.value?.toLowerCase()],
                },
            ],
            "freqCapType": 'user',
            "targetUrl": target_url.value,
            "frequency": frequency,
            "capping": capping,
            "impFrequency": impFrequency,
            "impCapping": impCapping,
            "rateModel": rateModel,
            "direction": direction,
            "status": 2,
            "evenlyLimitsUsage": Boolean(evenlyLimitsUsage),
            "trafficQuality": trafficQuality,
            "autoLinkNewZones": autoLinkNewZones,
            "isAdblockBuy": Boolean(isAdblockBuy),
            "isDSP": isDSP,
            "trafficBoost": trafficBoost,
            "startedAt": startedAt,
            "feed": feed,
            "trafficVertical": trafficVertical,
            "targeting": {
                "timeTable": {
                    'list': !placements_data?.value?.list.length && !placements_data?.value?.type ? ['Sun23'] : targeting.timeTable.list, //убрать расписание
                    isExcluded: false
                },
                "os": targeting.os,
                "osType": targeting.osType,
                "osVersion": targeting.osVersion ? targeting.osVersion : { "list": [], "isExcluded": false },
                "device": targeting.devxice ? targeting.device : { "list": [], "isExcluded": false },
                "deviceType": targeting.deviceType ? targeting.deviceType : { "list": [], "isExcluded": false },
                "country": {
                    "list": [
                        {
                            "id": String(country.value).toLowerCase(),
                            "code": String(country.value).toUpperCase(),
                        }
                    ],
                    "isExcluded": false,
                },
                "connection": 'all',
                "mobileIsp": targeting.mobileIsp ? fullDataCampaign.targeting.mobileIsp : { "list": [], "isExcluded": false },
                "proxy": targeting.proxy,
                "zone": {
                    "list": placements_data?.value?.list,
                    "isExcluded": Boolean(placements_data?.value?.type),
                },
                "browser": targeting.browser,
                "browserVersion": targeting.browserVersion,
                "language": targeting.language ? targeting.language : { "list": [], "isExcluded": false },
                "vertical": targeting.vertical ? targeting.vertical : { "list": [], "isExcluded": false },
                "campaignTrafficVertical": targeting.campaignTrafficVertical ? targeting.campaignTrafficVertical : { "list": [], "isExcluded": false },
            },
        };

        const externalUrl = `api/v2/campaigns/${newIdCampaign.value}/`;
        const responseCreateCampaign = await campaign.conn.api_conn?.put(`${externalUrl}`, dataFromCreateCampaign, {
            headers: {
                'Content-Type': "application/json"
            }
        }).then((d: any) => d.data);


        if (responseCreateCampaign && responseCreateCampaign.result
            && responseCreateCampaign.result === 'success'
        ) {
            campaign.id = newIdCampaign;
            campaign.status = new StatusCampaign('moderation');
            return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', campaign: campaign })
        } else {
            // LogPrinter.error(
            //     new Logger(responseCreateCampaign)
            //         .setCampaignId(dataCampaignNetwork.templateId)
            //         .setBundleId(dataCampaignNetwork.bundleId)
            //         .setStage(dataCampaignNetwork.stage)
            // );
            await campaign.removeUnit(newIdCampaign);
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: JSON.stringify(responseCreateCampaign) })
        }
    }

    /**
     * вытянуть все данные по кампании из сети
     * @param id 
     */
    static async fetch(conn: NetworkConnection, _id: IdCampaign): Promise<Campaign> {
        const campaign = new ClickaduCampaign(conn)
        const request_response = await campaign.getFullDataCampaign(_id);
        const get_name_ver = (title_ver: string) => {
            return title_ver.match(/\d+$/)?.[0]
        }
        const { id, name, targetUrl, targeting, rates } = request_response;
        const is_old_ver = name.toLowerCase().indexOf('old ver') !== -1;

        const externalUrl = `api/v1.0/client/targetings/all/`;
        const headers = {
            'Content-Type': 'application/json'
        };
        // console.log(`${this.clientData.baseUrl}${externalUrl}`, this.clientData.token);

        const all_versions: any[] = await campaign.conn.admin_conn?.get(externalUrl, {
            headers
        })
            .then((resp: { data: any; }) => resp?.data?.result?.browserVersion?.filter((f: any) => f?.id.startsWith('chrome'))
                .map((m: any) => get_name_ver(m.id)))

        // const _targeting = request_response?.targeting;
        const actual_list = targeting?.zone;
        const actual_ver = { name_ver: get_name_ver(targeting.browserVersion.list[targeting.browserVersion.list.length - 1].id), type: targeting.browserVersion.isExcluded ? 'last' : 'newORold' };
        const actual_ststus = request_response?.status;

        campaign.id = new IdCampaign(id)
        campaign.name = new NameCampaign(name);
        campaign.target_url = new TargetUrlCampaign(targetUrl)
        campaign.country = new CountryCampaign(targeting.country.list[0].id)
        campaign.bid = new BidCampaign(rates?.[0]?.amount)
        campaign.placements_data = new PlacementCampaign({
            list: actual_list?.list?.map((m: any) => m?.id) ?? [],
            type: actual_list?.isExcluded ?? false
        })
        campaign.status = new StatusCampaign([8, 7, 1].includes(actual_ststus) ? 'stopped' : actual_ststus === 3 ? 'rejected' : actual_ststus === 2 ? 'moderation' : 'working')
        campaign.browser_version = new BrowserVersionCampaign(is_old_ver ? null : (actual_ver.type === 'last' ? all_versions.filter((f: any) => Number(f) > Number(actual_ver.name_ver))?.[0] : actual_ver.name_ver))

        return campaign;
    }

    /**
     * Получение полной информации по кампании из сети
     * @param campaignId 
     * @returns 
     */
    private async getFullDataCampaign(campaignId: IdCampaign): Promise<any> {
        const externalUrl = `api/v1.0/client/campaigns/${campaignId.value}/`;
        let data: any = await this.conn.admin_conn?.get(externalUrl).then((resp: IHttpResponse) => resp.data);

        // new Logger({
        //     url,
        //     headers,
        //     data
        // })
        //     .setTag('getFullDataCampaign')
        //     .setDescription('Получение данных кампании из рекл сети')
        //     .setNetwork(this.constructor.name.toLowerCase())
        //     .setCampaignId(campaignId)
        //     .log();

        // this.customQuery({
        //     url: `${this.clientData.baseUrl}${externalUrl}`,
        //     method: 'get',
        //     headers: {
        //         'Authorization': 'Bearer ' + this.clientData.token
        //     },
        // }, this);

        return data?.result;
    }

    /**
    * Клонирвоание кампании
    * @param campaignId
    * @returns
    */
    private async clone(campaign_id: IdCampaign): Promise<IdCampaign | false> {
        const externalUrlClone = `api/v1.0/client/campaigns/${campaign_id.value}/clone/`;
        const externalUrlGet = `v1.0/api/client/campaigns/?limit=1&page=1&status=draft`;
        const postData = { name: "1" };
        // Клонируем кампанию
        const cloneCampaignId = await this.conn.admin_conn?.post(`${externalUrlClone}`, postData, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((d: IHttpResponse) => d.data);

        if (cloneCampaignId && cloneCampaignId.result && cloneCampaignId.result === 'success') {
            // Дёргаем ID новосозанной кампании
            const newCampaignId = await this.conn.api_conn?.get(`${externalUrlGet}`).then((d: any) => d.data);
            return newCampaignId.length && newCampaignId?.[0].id ? new IdCampaign(newCampaignId?.[0].id) : false;
        } else {
            return false;
        }
    }

    /**
     * Обновление площадок в кампании
     * @param data 
     * @returns 
     */
    async updatePlacements(data: PlacementCampaign): Promise<ResponceApiNetwork> {

        const _val = data.value;
        let list = _val?.list;
        let type = _val?.type;
        const typeList = !type ? 'targeted' : 'blocked';
        const externalUrl = `v1.0/api/client/campaigns/${this.id?.value}/${typeList}/zone/`;

        const headers = {
            'Content-Type': "application/json"
        };
        const responseSetPlacements = await this.conn.api_conn?.put(externalUrl, JSON.stringify(list), {
            headers
        }).then((d: IHttpResponse) => d.data);
        // new Logger({
        //     resp: responseSetPlacements.data,
        //     url,
        //     data: placements,
        //     headers
        // })
        //     .setTag('updateOnlyPlacement')
        //     .setNetwork(this.constructor.name.toLowerCase())
        //     .setCampaignId(dataSetPlacement.campaignId)
        //     .log();
        if (responseSetPlacements.resp?.error) {
            // new Logger(responseSetPlacements.data.resp?.error)
            //     .setTag('updateOnlyPlacement')
            //     .setDescription('Ошибка при обновлении кампании в рекл сети')
            //     .setNetwork(this.constructor.name.toLowerCase())
            //     .setCampaignId(dataSetPlacement.campaignId)
            //     .warning();
        }
        // const currentStatus = responseSetPlacements.data.id ? new StatusCampaign(responseSetPlacements.data.status).validStatus : responseSetPlacements.status === 304;
        // console.log(responseSetPlacements.data);
        // return currentStatus;
        // if (currentStatus === STATUS_CAMPAIGN_DRAFT) {
        //     return STATUS_CAMPAIGN_DRAFT;
        // } else {

        if (responseSetPlacements.id) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', campaign: this })
        } else if (responseSetPlacements.status === 304) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.NOT_MODIFIED, message: JSON.stringify(responseSetPlacements) })
        } else {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: JSON.stringify(responseSetPlacements) })
        }
        // return responseSetPlacements.data.id || responseSetPlacements.status === 304 ? true : responseSetPlacements.data;
        // }

    }


    /**
     * Удаление кампании
     */
    async remove(): Promise<ResponceApiNetwork> {
        // new Logger(campaignId).setDescription('Clickadu removeCampaign start').log();
        //Получаем статус кампании
        const oldStatusCampaign = this.status?.value;
        if (oldStatusCampaign !== "moderation") {
            await this.stop();
        } else {
            await this.cancelModeration();
        }
        //Удаляем кампанию
        return await this.removeUnit(this.id);
    }

    /**
     * Точеченое удаление кампании
     * @param id 
     * @returns 
     */
    private async removeUnit(id: IdCampaign): Promise<ResponceApiNetwork> {
        const listCampaignsFromRemove = { "campaignIds": [id.value] };
        const externalUrl = 'api/v1.0/client/campaigns/to_archive/';
        const headers = {
            'Content-Type': "application/json"
        };
        const responseRemove = await this.conn.admin_conn?.put(externalUrl, listCampaignsFromRemove, {
            headers
        }).then((resp: { data: any; }) => resp.data);
        const success = responseRemove && responseRemove.result && responseRemove.result === 'success';
        return new ResponceApiNetwork({ code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: success ? 'OK' : JSON.stringify(responseRemove) })
    }

    /**
     * Запуск кампании
     */
    async start(): Promise<ResponceApiNetwork> {
        const externalUrl = `api/v2/campaign/${this.id?.value}/change_status/start/`;

        const responseResume = await this.conn.api_conn?.post(externalUrl, {}).then((resp: IHttpResponse) => resp.data);
        // new Logger({
        //     url,
        //     headers,
        //     data: {},
        //     response: responseResume
        // })
        //     .setTag('resumeCampaign')
        //     .setDescription('Запуск кампании в рекл сети')
        //     .setNetwork(this.constructor.name.toLowerCase())
        //     .setCampaignId(campaignId)
        //     .log();

        const success = (responseResume && responseResume.result
            && responseResume.result === 'success') || (responseResume.error && responseResume.error.message.indexOf('rong status for advertiser') !== -1)

        return new ResponceApiNetwork({ code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: success ? 'OK' : JSON.stringify(responseResume) })
    }

    /**
     * Остановка кампании
     */
    async stop(): Promise<ResponceApiNetwork> {
        const externalUrl = `api/v2/campaign/${this.id?.value}/change_status/stop/`;
        // Получаем статус кампании
        const oldStatusCampaign = this.status?.value;
        if (oldStatusCampaign === 'draft' || oldStatusCampaign === 'stopped') {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK' })
        }
        // TODO: А что если тут false?
        if (!['stopped', 'working',
            'rejected', 'moderation'].includes(String(oldStatusCampaign))) {
            // LogPrinter.error(new Logger(oldStatusCampaign)
            //     .setCampaignId(campaignId)
            //     .setNetwork(this.constructor.name.toLowerCase())
            //     .setTag('stoppedCampaign'));
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: 'Unknown status' })
        }

        if (oldStatusCampaign === 'working') {
            const responseStopped = await this.conn.api_conn?.post(externalUrl, {}).then((resp: IHttpResponse) => resp.data);
            // new Logger({
            //     url,
            //     headers,
            //     data: {},
            //     response: responseStopped
            // })
            //     .setTag('stoppedCampaign')
            //     .setDescription('Остановка кампании в рекл сети')
            //     .setNetwork(this.constructor.name.toLowerCase())
            //     .setCampaignId(campaignId)
            //     .log();

            const success = responseStopped && responseStopped.result
                && responseStopped.result === 'success';
            return new ResponceApiNetwork({ code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: success ? 'OK' : JSON.stringify(responseStopped) });
        }

        return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK' });
    }

    /**
    * Отмена модерации
    * @param campaignId
    * @returns
    */
    private async cancelModeration(): Promise<boolean> {
        const externalUrl = 'api/v1.0/client/campaigns/cancel/';
        const listCampaignsFromCancelModeration = { "campaignIds": [this.id?.value] };

        const headers = {
            'Content-Type': "application/json"
        };
        const responseCancelModeration = await this.conn.admin_conn?.put(externalUrl, listCampaignsFromCancelModeration, {
            headers: headers
        }).then((resp: { data: any; }) => resp.data);

        // new Logger({
        //     responseCancelModeration,
        //     url,
        //     data: listCampaignsFromCancelModeration,
        //     headers,
        // })
        //     .setTag('cancelModeration')
        //     .setNetwork(this.constructor.name.toLowerCase())
        //     .setCampaignId(campaignId)
        //     .log();
        return responseCancelModeration && responseCancelModeration.result && responseCancelModeration.result === 'success';
    }

}