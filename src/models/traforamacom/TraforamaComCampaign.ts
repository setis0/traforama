import {
    BidCampaign,
    Campaign,
    ICampaign,
    PlacementCampaign,
    ResponceApiNetwork,
    ScheduleCampaign,
    StatsRaw,
    StatusCampaign
} from "@atsorganization/ats-lib-ntwk-common";
import IHttpResponse from "@atsorganization/ats-lib-ntwk-common/src/http/IHttpResponse";
import {RESPONSE_CODES} from "../../consts";
import {
    CreativeByIdData,
    CreativeListAttributes, CreativeListRoot,
    ParametersCampaignsCreate, ResponseCreativeById, ResponseCreativeList,
    ResponseError, ResponseNotAnswer,
    ResponseShowCreativeId,
    ShowCampaignsIDRoot,
    ShowCreativeIdAttributes, ShowCreativeIdRoot
} from "./api";

export default class TraforamaComCampaign extends Campaign {
    async getCreativeListByCompany(id: string) {
        const response = await this.getCreativeList()
        return response
            .filter(value => value.campaign_id.toString() === id)
    }

    async getCreativeById(id: string | number) {
        const response = await this.conn.api_conn?.get(`/v1/creatives/${id}/`) as ResponseCreativeById
        if (response.data.error) {
            throw new Error(response.data.error)
        }
        return response.data.data as CreativeByIdData
    }

    protected updateRaw(data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    getStatus(): Promise<ResponceApiNetwork<StatusCampaign>> {
        throw new Error("Method not implemented.");
    }

    updateSchedule(schedule: ScheduleCampaign): Promise<ResponceApiNetwork<Campaign>> {
        throw new Error("Method not implemented.");
    }

    async create(data: ICampaign): Promise<ResponceApiNetwork<Campaign>> {
        const {name, template_id, bid, country, placements_data, target_url, schedule, browser_version} = data;
        if (template_id.value === null) {
            return new ResponceApiNetwork({
                                              code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                              message: 'Not set template from network',
                                          });
        }
        const config: ParametersCampaignsCreate = {
            name: name.value as string,
            country_codes: [
                country.value as string
            ],

            language_ids: [],
            browser_ids: [],
            whitelist_domains: [
                "xx.com"
            ],
            blacklist_domains: [
                "xx.com"
            ],
        }
        try {
            const responseCompany = await this.getCompanyId(template_id.value)
            const responseCreativeList = await this.getCreativeListByCompany(template_id.value)

            const response = await this.conn.api_conn?.post('/v1/campaigns/', config)

        } catch (e) {
            return new ResponceApiNetwork({
                                              code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                              message: (e as Error).message,
                                          });
        }


        return new ResponceApiNetwork({code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this});
    }

    fetch(): Promise<ResponceApiNetwork<Campaign>> {
        throw new Error("Method not implemented.");
    }

    updatePlacements(data: PlacementCampaign): Promise<ResponceApiNetwork<Campaign>> {
        throw new Error("Method not implemented.");
    }

    update(): Promise<ResponceApiNetwork<Campaign>> {
        throw new Error("Method not implemented.");
    }

    async remove(): Promise<ResponceApiNetwork<unknown>> {
        this.handlerErrNotIdCampaign()
        const response = await this.conn.api_conn?.delete(`/v1/campaigns/${this.id}/`) as ResponseNotAnswer
        if (response.data?.error) {
            return new ResponceApiNetwork({
                                              code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                              message: response.data.error
                                          });
        }
        return new ResponceApiNetwork({
                                          code: RESPONSE_CODES.SUCCESS,
                                          message: 'OK'
                                      });

    }

    async start(): Promise<ResponceApiNetwork<unknown>> {
        this.handlerErrNotIdCampaign()
        const list = await this.getCreativeListByCompany(this.id)
        const ids = list.map(value => value.id)
        await Promise.all(
            ids.map(value => this.unpauseCreativeById(value))
        )
        return new ResponceApiNetwork<unknown>({
                                                   code: RESPONSE_CODES.SUCCESS,
                                                   message: 'OK'
                                               })
    }

    async stop(): Promise<ResponceApiNetwork<unknown>> {
        this.handlerErrNotIdCampaign()
        const list = await this.getCreativeListByCompany(this.id.value as string)
        const ids = list.map(value => value.id)
        await Promise.all(
            ids.map(value => this.pauseCreativeById(value))
        )
        return new ResponceApiNetwork<unknown>({
                                                   code: RESPONSE_CODES.SUCCESS,
                                                   message: 'OK'
                                               })
    }

    stats(date: string): Promise<ResponceApiNetwork<StatsRaw>> {
        throw new Error("Method not implemented.");
    }

    minBid(): Promise<ResponceApiNetwork<BidCampaign>> {
        throw new Error("Method not implemented.");
    }

    protected async _getCreativeList(offset: number, limit: number) {
        const response = await this.conn.api_conn?.get(`/v1/creatives/?start=${offset}&limit=${limit}`) as ResponseCreativeList
        if (response.data.error) {
            throw new Error(response.data.error)
        }
        return response.data as CreativeListRoot
    }

    protected async getCreativeList(limit: number = 10000) {
        const response = await this._getCreativeList(0, limit)
        const total = Number(response.meta.total)
        if (total >= limit) {
            const count = Math.ceil(total / limit)
            const result = [...response.data.map(value => value.attributes)]
            for (let i = 1; i <= count; i++) {
                const chunk = await this._getCreativeList(i * limit, limit)
                result.push(...chunk.data.map(value => value.attributes))
            }
            return result
        }
        return response.data.map(value => value.attributes) as CreativeListAttributes[]
    }

    protected async pauseCreativeById(id: number | string) {
        const response = await this.conn.api_conn?.post(`/v1/creatives/${id}/pause/`) as ResponseNotAnswer
        if(response.data.error){
            throw new Error(response.data.error)
        }
    }

    protected async unpauseCreativeById(id: number | string) {
        const response = await this.conn.api_conn?.post(`/v1/creatives/${id}/unpause/`) as ResponseNotAnswer
        if(response.data.error){
            throw new Error(response.data.error)
        }
    }

    protected async getCompanyId(id: string | number) {
        const response = await this.conn.api_conn?.get(`/v1/campaigns/${id}/`) as IHttpResponse & {
            data: ShowCampaignsIDRoot
        } | { data: ResponseError }
        if (response.data.error) {
            throw new Error(`${response.data.message}`)
        }
        return response.data as ShowCampaignsIDRoot
    }

    protected async getCreative(id: string | number) {
        const response = await this.conn.api_conn?.get(`/v1/creatives/${id}/`) as ResponseShowCreativeId
        if (response.data?.error) {
            throw new Error((response.data as ResponseError).message)
        }
        return (response.data as ShowCreativeIdRoot).data.attributes
    }

}
