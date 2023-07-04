interface IResultFullDataCampaignElemTargeting {
    list: {
        id: string;
        code: string;
        title: string;
    }[];
    isExcluded: boolean;
}
interface IResultFullDataCampaignSimpleElemTargeting {
    list: any[];
    isExcluded: boolean;
}
interface IResultFullDataCampaignRate {
    amount: number;
    countries: {
        id: string;
        code: string;
        title: string;
    }[] | string[];
    isFutureRate: boolean;
}
interface IResultFullDataCampaignTargeting {
    isSlowConnectionIncluded: number;
    connection: string;
    os: IResultFullDataCampaignElemTargeting;
    browser: IResultFullDataCampaignElemTargeting;
    browserVersion: IResultFullDataCampaignElemTargeting;
    country: IResultFullDataCampaignElemTargeting;
    osType: IResultFullDataCampaignElemTargeting;
    osVersion: IResultFullDataCampaignElemTargeting;
    deviceType: IResultFullDataCampaignElemTargeting;
    timeTable: IResultFullDataCampaignSimpleElemTargeting;
    mobileIsp: IResultFullDataCampaignElemTargeting;
    zone: IResultFullDataCampaignElemTargeting | IResultFullDataCampaignSimpleElemTargeting;
    language: IResultFullDataCampaignElemTargeting;
    proxy: number;
    vertical: IResultFullDataCampaignElemTargeting;
}
interface IResultFullDataCampaign {
    id: string;
    name: string;
    rates: IResultFullDataCampaignRate[];
    targetUrl: string;
    frequency: number;
    capping: number;
    isArchived: number;
    impFrequency: number;
    impCapping: number;
    rateModel: string;
    direction: string;
    status: number;
    evenlyLimitsUsage: number;
    trafficQuality: number;
    autoLinkNewZones: boolean;
    isAdblockBuy: number;
    trafficBoost: number;
    startedAt: string;
    feed: string;
    isDSP: boolean;
    trafficVertical: string;
    freqCapType: string;
    targeting: IResultFullDataCampaignTargeting;
}
export default class FullDataCampaign {
    readonly _value: IResultFullDataCampaign;
    constructor(_value: IResultFullDataCampaign);
    get value(): IResultFullDataCampaign;
    setTargetUrl(newTargetUrl: string): FullDataCampaign;
    setId(newId: string): FullDataCampaign;
    setName(newName: string): FullDataCampaign;
    setRates(newRates: IResultFullDataCampaignRate[]): FullDataCampaign;
    setStatus(newStatus: number): FullDataCampaign;
    setTargetingCountry(newTargetingCountry: IResultFullDataCampaignElemTargeting): FullDataCampaign;
    setTargetingTimeTable(newTargetingTimeTable: IResultFullDataCampaignSimpleElemTargeting): FullDataCampaign;
    setTargetingZone(newTargetingZone: IResultFullDataCampaignElemTargeting | IResultFullDataCampaignSimpleElemTargeting): FullDataCampaign;
    setTargetingConnection(newTargetingConnection: string): FullDataCampaign;
    setFreqCapType(newFreqCapType: string): FullDataCampaign;
}
export {};
