interface IResultFullDataCampaignMediaType {
  id: string;
  value: string;
}

interface IResultFullDataCampaignProject {
  id: string;
  name: string;
}

export interface IResultFullDataCampaignSchedule {
  [key: string]: number[];
}

export interface IUpdateDataCampaignSchedule extends IResultFullDataCampaignSchedule {}

export interface IResultFullDataCampaignBudget {
  dailyCap: number;
  hourlyCapEnable: boolean;
  totalBudget: number;
}

export interface IResultFullDataCampaignTargetingsItem {
  value: any[];
  mode: boolean;
}

export interface IResultFullDataCampaignTargetings {
  browsers: IResultFullDataCampaignTargetingsItem;
  countries: IResultFullDataCampaignTargetingsItem;
  devices: IResultFullDataCampaignTargetingsItem;
  os: IResultFullDataCampaignTargetingsItem;
  languages?: IResultFullDataCampaignTargetingsItem;
  carriers?: IResultFullDataCampaignTargetingsItem;
  spots?: IResultFullDataCampaignTargetingsItem;
  affiliates?: IResultFullDataCampaignTargetingsItem;
  sources?: IResultFullDataCampaignTargetingsItem;
}

export interface IResultFullDataCampaignCreative {
  id: string;
  aid: number;
  name: string;
  status: number; // 2 - moderation
  clickUrl: string;
}

export interface IResultFullDataCampaign {
  id?: string;
  aid?: number;
  name: string;
  status: number;
  format: string;
  mediaType: IResultFullDataCampaignMediaType;
  bid: number;
  freqCap: number;
  creatives: IResultFullDataCampaignCreative[];
  clickUrl: string;
  categories: string[];
  budget: IResultFullDataCampaignBudget;
  costModel: string;
  project: IResultFullDataCampaignProject;
  schedule: IResultFullDataCampaignSchedule;
  targetings: IResultFullDataCampaignTargetings;
  segments?: string[];
  placements: IResultFullDataCampaignTargetingsItem;
}

export default class FullDataCampaign {
  constructor(readonly _value: IResultFullDataCampaign) {}

  get value(): IResultFullDataCampaign {
    return this._value;
  }
}
