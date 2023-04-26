interface IResultFullDataCampaignElemTargeting {
    list: { id: string, code: string, title: string }[];
    isExcluded: boolean;
}


interface IResultFullDataCampaignSimpleElemTargeting {
    list: any[];
    isExcluded: boolean;
}

interface IResultFullDataCampaignRate {
    amount: number;
    countries: { id: string, code: string, title: string }[] | string[]
    isFutureRate: boolean
}

interface IResultFullDataCampaignTargeting {
    isSlowConnectionIncluded: number,
    connection: string;
    os: IResultFullDataCampaignElemTargeting;
    browser: IResultFullDataCampaignElemTargeting;
    browserVersion: IResultFullDataCampaignElemTargeting
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
    // campaignTrafficVertical: IResultFullDataCampaignElemTargeting;
}



interface IResultFullDataCampaign {
    id: string;
    name: string;
    rates: IResultFullDataCampaignRate[];
    targetUrl: string;
    frequency: number;
    capping: number;
    isArchived: number; //mabe boolean
    impFrequency: number;
    impCapping: number;
    rateModel: string;
    direction: string;
    status: number;
    evenlyLimitsUsage: number;
    trafficQuality: number;
    autoLinkNewZones: boolean;
    isAdblockBuy: number; //mabe boolean
    trafficBoost: number;
    startedAt: string;
    feed: string;
    isDSP: boolean;
    trafficVertical: string;
    freqCapType: string;
    targeting: IResultFullDataCampaignTargeting;
}

export default class FullDataCampaign {
    constructor(
        readonly _value: IResultFullDataCampaign
    ) { }

    get value(): IResultFullDataCampaign {
        return this._value;
    }

    setTargetUrl(newTargetUrl: string): FullDataCampaign {
        this._value.targetUrl = newTargetUrl;
        return this;
    }

    setId(newId: string): FullDataCampaign {
        this._value.id = newId;
        return this;
    }

    setName(newName: string): FullDataCampaign {
        this._value.name = newName;
        return this;
    }

    setRates(newRates: IResultFullDataCampaignRate[]): FullDataCampaign {
        this._value.rates = newRates;
        return this;
    }

    setStatus(newStatus: number): FullDataCampaign {
        this._value.status = newStatus;
        return this;
    }

    setTargetingCountry(newTargetingCountry: IResultFullDataCampaignElemTargeting): FullDataCampaign {
        this._value.targeting.country = newTargetingCountry;
        return this;
    }

    setTargetingTimeTable(newTargetingTimeTable: IResultFullDataCampaignSimpleElemTargeting): FullDataCampaign {
        this._value.targeting.timeTable = newTargetingTimeTable;
        return this;
    }


    setTargetingZone(newTargetingZone: IResultFullDataCampaignElemTargeting | IResultFullDataCampaignSimpleElemTargeting): FullDataCampaign {
        this._value.targeting.zone = newTargetingZone;
        return this;
    }

    setTargetingConnection(newTargetingConnection: string): FullDataCampaign {
        this._value.targeting.connection = newTargetingConnection;
        return this;
    }

    setFreqCapType(newFreqCapType: string): FullDataCampaign {
        this._value.freqCapType = newFreqCapType;
        return this;
    }

}