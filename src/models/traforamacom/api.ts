import IHttpResponse from "@atsorganization/ats-lib-ntwk-common/src/http/IHttpResponse";

export enum AdTypes {
    all = 0,
    banner = 1,
    popunder = 2,
    video = 6,
    slider =8,
    interstitial = 9 ,
    in_page_push = 10
}
// export enum Grouping{
//     date = "day", country = "geo", creature = "creative," ad_type = ad format, browser - browser, campaign - campaign, connection - connection type, device - device, IP - IP address, platform - platform, proxy_type - proxy type, referer_host - referer hosts, spot - spot, stream - stream, feed -
// feed
// }
// export interface ReportDimensions {
//     ad_types:AdTypes,
//     //dd.mm.yyyy+-+dd.mm.yyy
//     period: string,
//     conversion_types:string
//     group_by:
// }
export type ResponseCountry = IHttpResponse & {data:CountryRoot|ResponseError}
export interface CountryRoot {
    data: CountryDaum[]
    meta: Meta
}

export interface CountryDaum {
    id: string
    type: string
    attributes: CountryAttributes
}

export interface CountryAttributes {
    name: string
    iso: string
    tier: number
    is_eu: boolean
}

export type ResponseDspMinimalCpms = IHttpResponse & {data:DspMinimalCpmsRoot|ResponseError}
export interface DspMinimalCpmsRoot {
    data: DspMinimalCpmsDaum[]
    meta: Meta
}

export interface DspMinimalCpmsDaum {
    id: string
    type: string
    attributes: DspMinimalCpmsAttributes
}

export interface DspMinimalCpmsAttributes {
    value: number
    country_id: number
    value_max: number
}

export type ResposeReport = IHttpResponse & { data:Report[]|ResponseError}
export interface Report {
    name: string
    hits: number
    clicks: number
    bounces: number
    bounce_rate: number
    ctr: number
    broker_hits: number
    broker_clicks: number
    broker_bounces: number
    broker_income: number
    broker_cpm: number
    broker_ctr: number
    real_cpm: number
    hits_to_clicks: number
    discrepancy: number
    conversion101: number
    broker_bounce_rate: number
    broker_cpc: number
    requests: number
    impressions: number
    ecpa101: number
    ectr101: number
}

export type ResponseNotAnswer = IHttpResponse & { data: ResponseError }

export interface CreateCreative {
    name: string
    link_url: string
    code: string
    hide_referrer: boolean
    aggressive: boolean
    refresh_rate: number
    no_bounces: boolean
    skip_if_no_ref: boolean
    skip_if_no_cookies: boolean
    skip_if_x_requested_with: boolean
    no_onloop: boolean
    float_rate: boolean
    block_proxy_type_ids: number[]
    prices: Price[]
    image: string
    video: string
    icon: string
    remote_url: string
    vast_tag: string
    title: string
    description: string
    skip_offset: number
    campaign_id: number
    subtype_id: number
    advert_state: string
}

export interface Price {
    id: string
    value: number
}

export interface ApiBalance {
    balance: number
}

export interface ResponseError {
    error: string,
    message: string
}

export interface ParametersCampaignsCreate {
    name: string
    stream: number
    type_id: number
    size_id: number
    included_spots: string[]
    excluded_spots: number[]
    country_codes: string[]
    device_ids: string[]
    connection_type_ids: string[]
    platform_ids: number[]
    browser_ids: string[]
    weekdays: string[]
    hours: string[]
    specific_platforms: SpecificPlatform[]
    specific_browsers: SpecificBrowser[]
    start_at: string
    finish_at: string
    isp: string
    limits: Limit[]
    ips: string[]
    whitelist_domains: string[]
    blacklist_domains: string[]
    use_whitelist_domains: boolean
    language_ids: string[]
}

export interface SpecificPlatform {
    id: string
    version: string
    comparison: string
}

export interface SpecificBrowser {
    id: string
    version: string
    comparison: string
}

export interface Limit {
    type_id: string
    value: number
}


export interface ShowCampaignsIDRoot {
    data: ShowCampaignsIDData
}

export interface ShowCampaignsIDData {
    id: string
    type: "campaign"
    attributes: ShowCampaignsIDAttributes
}

export interface ShowCampaignsIDAttributes {
    id: number
    name: string
    stream: number
    disabled: boolean
    type_id: number
    isp: string
    weekdays: any[]
    hours: any[]
    use_whitelist_domains: boolean
    blacklist_domains: string[]
    whitelist_domains: string[]
    size_id: number
    ip_range_type: number
    use_whitelist_user_agents: boolean
    blacklist_user_agents: any[]
    whitelist_user_agents: any[]
    keywords: any[]
    spots_list_ids: any[]
    ip_list_ids: any[]
    spot_ids: any[]
    connection_type_ids: any[]
    device_ids: any[]
    browser_ids: number[]
    specific_platforms: any[]
    platform_ids: number[]
    specific_browsers: any[]
    language_ids: number[]
    city_ids: any[]
    region_ids: any[]
    ron_type: number
    country_codes: any[]
    start_at: string
    finish_at: string
    limits: any[]
    cpm_floor_to_confirm: number
    ips: any[]
    use_whitelist_ip: boolean
}

export type ResponseShowCreativeId = IHttpResponse & { data: ShowCampaignsIDRoot | ResponseError }

export interface ShowCreativeIdRoot {
    data: ShowCreativeIdData
}

export interface ShowCreativeIdData {
    id: string
    type: string
    attributes: ShowCreativeIdAttributes
}

export interface ShowCreativeIdAttributes {
    id: number
    name: string
    advert_state: string
    campaign_id: number
    asset_processed: boolean
    aggressive: boolean
    flat_deal: boolean
    status_change_reason: any
    vertical_id: number
    title: string
    description: string
    link_url: string
    deal_status: string
    possible_events: string[]
    vertical: string
    show_processing: boolean
    image_preview: string
    video_preview: string
    icon_preview: string
    refresh_rate: number
    hide_referrer: boolean
    cpm_calculation_type: string
    no_bounces: boolean
    skip_if_no_ref: boolean
    skip_if_no_cookies: boolean
    skip_if_x_requested_with: boolean
    no_onloop: boolean
    block_proxy_type_ids: any[]
    subtype_id: number
    remote_url: any
    vast_tag: string
    code: string
    only_proxy_traffic: boolean
    impression_url: any
    prices: Price[]
    skip_offset: number
    video_source: number
    available_cpm_types: string[]
}

export interface Price {
    id: string
    value: number
}

export type ResponseCreativeList = IHttpResponse & { data: CreativeListRoot | ResponseError }

export interface CreativeListRoot {
    data: CreativeListDaum[]
    meta: Meta
}

export interface CreativeListDaum {
    id: string
    type: string
    attributes: CreativeListAttributes
}

export interface CreativeListAttributes {
    id: number
    name: string
    campaign_type_id: number
    campaign_id: number
}

export interface Meta {
    total: number
}

export type ResponseCreativeById = IHttpResponse & { data: CreativeByIdRoot | ResponseError }

export interface CreativeByIdRoot {
    data: CreativeByIdData
}

export interface CreativeByIdData {
    id: string
    type: string
    attributes: CreativeByIdAttributes
}

export interface CreativeByIdAttributes {
    id: number
    name: string
    advert_state: string
    campaign_id: number
    asset_processed: boolean
    aggressive: boolean
    flat_deal: boolean
    status_change_reason: any
    vertical_id: number
    title: string
    description: string
    link_url: string
    deal_status: string
    possible_events: string[]
    vertical: string
    show_processing: boolean
    image_preview: string
    video_preview: string
    icon_preview: string
    refresh_rate: number
    hide_referrer: boolean
    cpm_calculation_type: string
    no_bounces: boolean
    skip_if_no_ref: boolean
    skip_if_no_cookies: boolean
    skip_if_x_requested_with: boolean
    no_onloop: boolean
    block_proxy_type_ids: any[]
    subtype_id: any
    remote_url: any
    vast_tag: string
    code: string
    only_proxy_traffic: boolean
    impression_url: any
    prices: Price[]
    skip_offset: number
    video_source: number
    available_cpm_types: string[]
}

export interface Price {
    id: string
    value: number
}

