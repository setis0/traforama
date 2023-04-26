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
import FullDataCampaign from "./api/FullDataCampaign";
import ScheduleCampaign from "../ScheduleCampaign";

export default class ClickaduCampaign extends Campaign {

    /**
     * Создание кампании
     * @param conn 
     * @param data 
     * @returns 
     */
    async create(data: ICampaign, schedule: ScheduleCampaign = new ScheduleCampaign()): Promise<ResponceApiNetwork> {
        const { name, template_id, bid, country, placements_data, target_url } = data;

        const fullDataCampaign: FullDataCampaign | null = await this.getFullDataCampaign(new IdCampaign(template_id.value));
        if (!fullDataCampaign) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: 'Not get data from network' })
        }

        if (!target_url.value) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: 'Not get data from network' })
        }
        const newIdCampaign = await this.clone(new IdCampaign(template_id.value));
        if (!newIdCampaign) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: 'Error clone campaign in network' })
        }


        fullDataCampaign
            .setId(String(newIdCampaign.value))
            .setName(String(name.value))
            .setRates([
                {
                    amount: Math.ceil(Number(bid.value) * 100) / 100,
                    countries: [String(country.value?.toLowerCase())],
                    isFutureRate: false
                }
            ])
            .setTargetUrl(target_url.value)
            .setStatus(2)
            .setTargetingCountry({
                list: [{
                    id: String(country.value).toLowerCase(),
                    title: String(country.value).toUpperCase(),
                    code: String(country.value).toUpperCase(),
                }],
                isExcluded: false
            })
            .setTargetingConnection('all')
            .setTargetingZone({
                list: placements_data.value?.list ?? [],
                isExcluded: placements_data.value?.type ?? false
            })
            .setTargetingTimeTable({
                list: schedule.value,
                isExcluded: false
            })
            .setFreqCapType('user');


        // return fullDataCampaign.value;
        const responseCreateCampaign = await this.updateRaw(fullDataCampaign);


        if (responseCreateCampaign && responseCreateCampaign.result
            && responseCreateCampaign.result === 'success'
        ) {
            this.setId(newIdCampaign)
                .setName(name)
                .setTemplateId(template_id)
                .setBid(bid)
                .setCountry(country)
                .setPlacementsData(placements_data)
                .setTargetUrl(target_url)
                .setStatus(new StatusCampaign('moderation'))

            return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', campaign: this })
        } else {
            // LogPrinter.error(
            //     new Logger(responseCreateCampaign)
            //         .setCampaignId(dataCampaignNetwork.templateId)
            //         .setBundleId(dataCampaignNetwork.bundleId)
            //         .setStage(dataCampaignNetwork.stage)
            // );
            await this.removeUnit(newIdCampaign);
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: JSON.stringify(responseCreateCampaign) })
        }
    }

    /**
     * Подгттовка корректного статуса для API
     * @param data 
     * @returns 
     */
    private prepareStatus(data: FullDataCampaign) {
        const { isArchived, status } = data.value;
        return new StatusCampaign(isArchived ? 'archived' : [8, 7, 1].includes(status) ? 'stopped' : status === 3 ? 'rejected' : status === 2 ? 'moderation' : 'working');
    }

    /**
     * Устаноыка расписания кампании
     * по-умолчанию полное расписание
     * @param schedule 
     */
    async updateSchedule(schedule: ScheduleCampaign = new ScheduleCampaign()): Promise<ResUpdPlcmtCampaign> {
        this.handlerErrNotIdCampaign();
        const fullDataCampaign: FullDataCampaign | null = await this.getFullDataCampaign(this.id);
        if (!fullDataCampaign) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: 'Not get data from network' })
        }
        const { targeting, id, name, rates } = fullDataCampaign.value;
        console.log(targeting.country);
        fullDataCampaign
            .setRates(
                [{
                    amount: rates?.[0]?.amount,
                    isFutureRate: rates?.[0]?.isFutureRate,
                    countries: rates?.[0]?.countries.map((m: any) => m.id)
                }]
            )
            .setTargetingTimeTable({
                list: schedule.value,
                isExcluded: false
            })
            .setTargetingZone(
                {
                    list: targeting.zone?.list.map((m: any) => m.id) ?? [],
                    isExcluded: targeting.zone?.isExcluded ?? false
                }
            )
            .setFreqCapType('user')
            .setTargetingConnection('all')

        const responseUpdateCampaign = await this.updateRaw(fullDataCampaign);

        if (responseUpdateCampaign && responseUpdateCampaign.result
            && responseUpdateCampaign.result === 'success'
        ) {
            this.setId(new IdCampaign(id))
                .setName(new NameCampaign(name))
                .setBid((new BidCampaign(rates?.[0]?.amount)))
                .setStatus(this.prepareStatus(fullDataCampaign))
                .setSchedule(schedule)

            return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', campaign: this })
        } else {
            // LogPrinter.error(
            //     new Logger(responseCreateCampaign)
            //         .setCampaignId(dataCampaignNetwork.templateId)
            //         .setBundleId(dataCampaignNetwork.bundleId)
            //         .setStage(dataCampaignNetwork.stage)
            // );
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: JSON.stringify(responseUpdateCampaign) })
        }
    }


    /**
     * вытянуть все данные по кампании из сети
     */
    async fetch(): Promise<ResponceApiNetwork> {
        this.handlerErrNotIdCampaign();
        const fullDataResponse: FullDataCampaign | null = await this.getFullDataCampaign(this.id);
        if (!fullDataResponse) {
            return new ResponceApiNetwork({ code: RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: 'Not get data from network' })
        }
        const get_name_ver = (title_ver: string) => {
            return title_ver.match(/\d+$/)?.[0]
        }
        const { id, name, targetUrl, status, targeting, rates } = fullDataResponse.value;
        const is_old_ver = name.toLowerCase().indexOf('old ver') !== -1;

        const externalUrl = `api/v1.0/client/targetings/all/`;
        const headers = {
            'Content-Type': 'application/json'
        };
        // console.log(`${this.clientData.baseUrl}${externalUrl}`, this.clientData.token);

        const all_versions: any[] = await this.conn.admin_conn?.get(externalUrl, {
            headers
        })
            .then((resp: { data: any; }) => resp?.data?.result?.browserVersion?.filter((f: any) => f?.id.startsWith('chrome'))
                .map((m: any) => get_name_ver(m.id)))

        // const _targeting = request_response?.targeting;
        const actual_list = targeting?.zone;
        const actual_ver = { name_ver: get_name_ver(targeting.browserVersion.list[targeting.browserVersion.list.length - 1].id), type: targeting.browserVersion.isExcluded ? 'last' : 'newORold' };
        const actual_ststus = status;

        this
            .setId(new IdCampaign(id))
            .setName(new NameCampaign(name))
            .setTargetUrl(new TargetUrlCampaign(targetUrl))
            .setCountry(new CountryCampaign(targeting.country.list[0].id))
            .setBid(new BidCampaign(rates?.[0]?.amount))
            .setPlacementsData(new PlacementCampaign({
                list: actual_list?.list?.map((m: any) => m?.id) ?? [],
                type: actual_list?.isExcluded ?? false
            }))
            .setStatus(this.prepareStatus(fullDataResponse))
            .setSchedule(new ScheduleCampaign(targeting.timeTable.list))
            .setBrowserVersion(new BrowserVersionCampaign(is_old_ver ? null : (actual_ver.type === 'last' ? all_versions.filter((f: any) => Number(f) > Number(actual_ver.name_ver))?.[0] : actual_ver.name_ver)))

        return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', campaign: this });
    }

    /**
     * обновлене кампании
     * @param data 
     * @returns 
     */
    protected async updateRaw(data: FullDataCampaign): Promise<any> {
        const externalUrl = `api/v2/campaigns/${data.value.id}/`;
        return await this.conn.api_conn?.put(`${externalUrl}`, data.value, {
            headers: {
                'Content-Type': "application/json"
            }
        }).then((d: IHttpResponse) => d.data);
    }

    /**
     * Получение полной информации по кампании из сети
     * @param campaignId 
     * @returns 
     */
    private async getFullDataCampaign(campaignId: IdCampaign): Promise<FullDataCampaign | null> {
        const externalUrl = `api/v1.0/client/campaigns/${campaignId.value}/`;
        let data: FullDataCampaign | null = null;
        if (this.conn.admin_conn) {
            data = await this.conn.admin_conn.get(externalUrl).then((resp: IHttpResponse) => {
                const r = resp.data.result;
                return new FullDataCampaign({
                    id: r.id,
                    name: r.name,
                    rates: r.rates,
                    targetUrl: r.targetUrl,
                    frequency: r.frequency,
                    capping: r.capping,
                    isArchived: r.isArchived,
                    impFrequency: r.impFrequency,
                    impCapping: r.impCapping,
                    freqCapType: r.freqCapType,
                    rateModel: r.rateModel,
                    direction: r.direction,
                    status: r.status,
                    evenlyLimitsUsage: r.evenlyLimitsUsage,
                    trafficQuality: r.trafficQuality,
                    autoLinkNewZones: r.autoLinkNewZones ?? false,
                    isAdblockBuy: r.isAdblockBuy,
                    trafficBoost: r.trafficBoost,
                    startedAt: r.startedAt,
                    feed: r.feed,
                    isDSP: r.isDSP,
                    trafficVertical: r.trafficVertical,
                    targeting: r.targeting,
                })
            }
            );

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
        }
        return data;
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
     * Получение статуса кампани
     * @param id 
     * @returns 
     */
    async getStatus(): Promise<StatusCampaign> {
        this.handlerErrNotIdCampaign();
        const externalUrl = 'api/v2/campaigns/' + this.id.value + '/';
        const responseStatus = await this.conn.api_conn?.get(externalUrl).then((d: IHttpResponse) => d.data)
        return this.prepareStatus(new FullDataCampaign(responseStatus));
    }

    /**
     * Обновление площадок в кампании
     * @param data 
     * @returns 
     */
    async updatePlacements(data: PlacementCampaign): Promise<ResponceApiNetwork> {
        this.handlerErrNotIdCampaign();
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
        }, (status: number) => status === 400 || status === 200).then((d: IHttpResponse) => d.data);
        // console.log(responseSetPlacements);
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
            this
                .setPlacementsData(new PlacementCampaign({
                    list: list ?? [],
                    type: type ?? false
                }))
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
        this.handlerErrNotIdCampaign();
        // new Logger(campaignId).setDescription('Clickadu removeCampaign start').log();
        //Получаем статус кампании

        if (!this.status?.value) {
            this.status = await this.getStatus();
        }

        if (this.status.value === 'archived') {
            return new ResUpdPlcmtCampaign({ code: RESPONSE_CODES.BAD_REQUEST, message: 'Campaign already removed' })
        }

        if (this.status.value !== "moderation") {
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
        this.handlerErrNotIdCampaign();
        const externalUrl = `api/v2/campaign/${this.id?.value}/change_status/stop/`;
        const responseStopped = await this.conn.api_conn?.post(externalUrl, {}).then((resp: IHttpResponse) => resp.data);

        const success = (responseStopped && responseStopped.result
            && responseStopped.result === 'success') || responseStopped.error.message?.indexOf('Got: stop') !== -1;

        return new ResponceApiNetwork({ code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.BAD_REQUEST, message: success ? 'OK' : JSON.stringify(responseStopped) })
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
        }).then((resp: IHttpResponse) => resp.data);

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