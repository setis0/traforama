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
import {IStatsRaw} from "@atsorganization/ats-lib-ntwk-common/src/models/StatsRaw";
import {RESPONSE_CODES} from "../../consts";
import {
    AdTypes,
    CreateCreative,
    CreativeByIdData,
    CreativeListAttributes,
    CreativeListRoot,
    DspMinimalCpmsRoot,
    ParametersCampaignsCreate,
    ReportJobResultResult,
    ReportJobResultResultData,
    RequestReportJob,
    ResponseCreativeById,
    ResponseCreativeList,
    ResponseDspMinimalCpms,
    ResponseError,
    ResponseNotAnswer,
    ResponseReportJob,
    ResponseReportJobResult,
    ResponseShowCreativeId,
    ShowCampaignsIDRoot,
    ShowCreativeIdRoot
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

    async createCreative(config: CreateCreative) {
        if (typeof config.name != "string" || typeof config.link_url != "string" || config.name != "" || config.link_url != "") {
            throw new Error(`required parameters are not entered`)
        }
        const response = await this.conn.api_conn?.post('/v1/creatives/', config) as ResponseNotAnswer
        if (response.data.error) {
            throw new Error(response.data.message)
        }
    }


    protected async _getMinBid(offset: number = 0, limit: number = 1e3) {
        const response = await this
            .conn
            .api_conn
            ?.get(`/v1/dsp_minimal_cpms/?filter[type_id]=2&start=${offset}&limit=${limit}`) as ResponseDspMinimalCpms
        if (response.data.error) {
            throw new Error(response.data.message)
        }
        return response.data as DspMinimalCpmsRoot
    }

    protected async getMinBid(limit: number = 1e3) {
        const response = await this._getMinBid(0, limit)
        const total = response.meta.total
        if (limit > total) {
            const count = Math.ceil(total / limit)
            const result = [...response.data]
            for (let i = 1; count >= i; i++) {
                const data = await this._getMinBid(limit * i, limit)
                result.push(...data.data)
            }
            return result
        }
        return response.data
    }

    protected updateRaw(data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getStatus(): Promise<ResponceApiNetwork<StatusCampaign>> {
        this.handlerErrNotIdCampaign()
        const list = await this.getCreativeListByCompany(this.id.value as string)
        const ids = list.map(value => value.id)
        if (ids.length === 0) {
            return new ResponceApiNetwork<StatusCampaign>({
                                                              code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                                              message: 'not found '
                                                          })
        }
        const getStatus = (status: string) => {
            // @ts-ignore
            let collection: { [id: string]: string } = this.conn.network.collections?.status;
            return (collection.hasOwnProperty(status)) ? collection[status] : null
        }
        // let data: StatusCampaign | StatusCampaign[]
        // if (ids.length > 1) {
        //     const creativeList = await Promise.all(ids.map(id => this.getCreativeById(id)))
        //     // @ts-ignore
        //     data = creativeList.map(value => new StatusCampaign((value === undefined)
        //                                                             ? null
        //                                                             : getStatus(value.attributes.advert_state))
        //     )
        // } else {
            const creative = await this.getCreativeById(ids[0])
            const data = new StatusCampaign(getStatus(creative.attributes.advert_state))
        // }

        return new ResponceApiNetwork<StatusCampaign>({
                                                          code: RESPONSE_CODES.SUCCESS,
                                                          data
                                                      })


    }

    updateSchedule(schedule: ScheduleCampaign): Promise<ResponceApiNetwork<Campaign>> {
        throw new Error("Method not implemented.");
    }

    async create(data: ICampaign): Promise<ResponceApiNetwork<Campaign>> {
        throw new Error("Method not implemented.");
        const {name, template_id, bid, country, placements_data, target_url, schedule, browser_version} = data;
        if (template_id.value === null) {
            return new ResponceApiNetwork({
                                              code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                              message: 'Not set template from network',
                                          });
        }
        const dataCountry = this.conn.getCountryByCode()
        if (dataCountry === null) {
            return new ResponceApiNetwork({
                                              code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                              message: 'Not set country from network',
                                          });
        }
        const config: ParametersCampaignsCreate = {
            name: name.value as string,
            country_codes: [
                dataCountry as string
            ],
        }
        try {
            const responseCompany = await this.getCompanyId(template_id.value)
            const responseCreativeList = await this.getCreativeListByCompany(template_id.value)
            await Promise.all(responseCreativeList
                                  .map(value => value.id)
                                  .map(value => this.getCreativeById(value)))
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

    async remove(): Promise<ResponceApiNetwork> {
        this.handlerErrNotIdCampaign()
        const response = await this.conn.api_conn?.delete(`/v1/campaigns/${this.id}/`) as ResponseNotAnswer
        if (response.data?.error) {
            return new ResponceApiNetwork({
                                              code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                              message: response.data.message
                                          });
        }
        return new ResponceApiNetwork({
                                          code: RESPONSE_CODES.SUCCESS,
                                          message: 'OK'
                                      });

    }

    async start(): Promise<ResponceApiNetwork> {
        this.handlerErrNotIdCampaign()
        const list = await this.getCreativeListByCompany(this.id.value as string)
        const ids = list.map(value => value.id)
        await Promise.all(
            ids.map(value => this.unpauseCreativeById(value))
        )
        return new ResponceApiNetwork({
                                          code: RESPONSE_CODES.SUCCESS,
                                          message: 'OK'
                                      })
    }

    async stop(): Promise<ResponceApiNetwork> {
        this.handlerErrNotIdCampaign()
        const list = await this.getCreativeListByCompany(this.id.value as string)
        const ids = list
            .map(value => value.id)
        await Promise.all(
            ids.map(value => this.pauseCreativeById(value))
        )
        return new ResponceApiNetwork({
                                          code: RESPONSE_CODES.SUCCESS,
                                          message: 'OK'
                                      })
    }

    async stats(date: string): Promise<ResponceApiNetwork<StatsRaw>> {
        this.handlerErrNotIdCampaign()
        // const response = await this.conn.api_conn?.get('/report?') as ResposeReport
        const responseReportJob = await this.conn.api_conn?.post('/v1/responded_jobs/', {
            args: {
                ad_types: AdTypes.popunder,
                campaigns_ids: [
                    this.id.value as string
                ],
                finish_at: date,
                start_at: date,
                period: date,
                group_by: "date",

            },
            type: "type_user_report"
        } as RequestReportJob) as ResponseReportJob
        if (responseReportJob.status === 400 || responseReportJob.data.error) {
            return new ResponceApiNetwork<StatsRaw>({
                                                        code: RESPONSE_CODES.NOT_FOUND,
                                                        message: responseReportJob.data.message
                                                    })
        }
        const id = responseReportJob.data.id
        const responseReportJobResult = await this.conn.api_conn?.get(`/v1/responded_jobs/${id}/`) as ResponseReportJobResult
        if (responseReportJobResult.status === 400 || responseReportJobResult.data.error) {
            return new ResponceApiNetwork<StatsRaw>({
                                                        code: RESPONSE_CODES.NOT_FOUND,
                                                        message: responseReportJobResult.data.message
                                                    })
        }
        const result = (responseReportJobResult.data.data.attributes.result as ReportJobResultResult[]).map<IStatsRaw>(value => {
            const data = (value.data as ReportJobResultResultData)
            return {
                id_campaign: this.id.value,
                report_date: data.,
                impressions: value.impressions,
                site_id: "",
                bundle_id: "",
                cost:,
                source_id: ""

            }
        })
        return new ResponceApiNetwork<StatsRaw>({
                                                    code: RESPONSE_CODES.SUCCESS,
                                                    data: result.map(value => new StatsRaw(value))
                                                })
    }

    async minBid(): Promise<ResponceApiNetwork<BidCampaign>> {
        this.handlerErrNotIdCampaign()
        this.handlerErrNotCountryCampaign()

        const list = await this.getMinBid()
        const [country = null] = list
            .filter(value => value.attributes.country_id)
            .map(value => value.attributes)
        if (country === null) {
            return new ResponceApiNetwork({
                                              code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                              message: `не найдена страна код:${this.country.value}`,
                                          });
        }

        return new ResponceApiNetwork({
                                          code: RESPONSE_CODES.SUCCESS,
                                          message: 'OK',
                                          data: new BidCampaign(country.value)
                                      });
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
        if (response.data.error) {
            throw new Error(response.data.error)
        }
    }

    protected async unpauseCreativeById(id: number | string) {
        const response = await this.conn.api_conn?.post(`/v1/creatives/${id}/unpause/`) as ResponseNotAnswer
        if (response.data.error) {
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
