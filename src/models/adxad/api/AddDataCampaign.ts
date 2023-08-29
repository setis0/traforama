import {
  IResultFullDataCampaignBudget,
  IResultFullDataCampaignSchedule,
  IResultFullDataCampaignTargetings,
  IResultFullDataCampaignTargetingsItem
} from './FullDataCampaign';

export interface IUpdateDataCampaignZone {
  idzone: number;
  price: number;
}

export interface IUpdateDataCampaignZoneTargeting {
  type: number;
  network_selection: number;
  partner_networks: number;
}

export interface IAddDataCampaign {
  name: string;
  project: string;
  costModel: string;
  format: string;
  mediaType: string;
  freqCap: number;
  clickUrl: string;
  bid: number;
  categories: string[];
  budget: IResultFullDataCampaignBudget;
  schedule: IResultFullDataCampaignSchedule;
  targetings: IResultFullDataCampaignTargetings;
  segments: string[];
  placements: IResultFullDataCampaignTargetingsItem;
}

export default class AddDataCampaign {
  constructor(readonly _value: IAddDataCampaign) {}

  get value(): IAddDataCampaign {
    return this._value;
  }

  setName(name: string): AddDataCampaign {
    this._value.name = name;
    return this;
  }

  setBid(bid: number): AddDataCampaign {
    this._value.bid = bid;
    return this;
  }

  setCountry(country: string): AddDataCampaign {
    this._value.targetings.countries = { value: [country], mode: true };
    return this;
  }

  setPLacements(placements: { list: any[]; type: boolean }): AddDataCampaign {
    const { list, type } = placements;
    this._value.targetings.spots = {
      value: list,
      mode: !type
    };
    return this;
  }

  prepare(): AddDataCampaign {
    const v: any = this._value;
    delete v.id;
    delete v.aid;
    delete v.creatives;
    delete v.manager;
    delete v.partner;
    delete v.team;
    delete v.status;
    delete v.targetings.cidr;
    delete v.targetings.iab;
    delete v.targetings.keywords;
    delete v.targetings.subscriptionDays;
    return this;
  }
}
