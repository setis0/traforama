interface IResultFullDataCampaignDataLimitCountersItem {
  hour: any[];
  day: any[];
  week: any[];
  month: any[];
  all: any[];
}

interface IResultFullDataCampaignDataLimitCounters {
  cost: IResultFullDataCampaignDataLimitCountersItem;
  view: IResultFullDataCampaignDataLimitCountersItem;
  click: IResultFullDataCampaignDataLimitCountersItem;
}

export interface IResultFullDataCampaignDataLimits {
  cost: IResultFullDataCampaignDataLimitCountersItem;
  view: IResultFullDataCampaignDataLimitCountersItem;
  viewPerUser: IResultFullDataCampaignDataLimitCountersItem;
}

export interface IResultFullDataCampaignDataTargetSources {
  direct: boolean;
  type: 'blacklist' | 'whitelist';
  data: string;
  accessSSP: number[];
  useAllSsp: boolean;
}
export interface IResultFullDataCampaignDataTargetingsDataItem {
  id: string;
  title: string;
}

interface IResultFullDataCampaignDataTargetingsData extends IResultFullDataCampaignDataTargetingsDataItem {
  checked: boolean;
}

interface IResultFullDataCampaignDataTargetingsDeviceData {
  connectionTypes: {
    id: string;
    name: string;
    nodeType: string;
    parentId: string | null;
    deviceNodeType: string;
    statRedirectId: string | null;
    title: string;
    group: number;
    checked: boolean;
  }[];
  operators: any[]; // TODO: узнать тип
  include: number;
}

export interface IResultFullDataCampaignDataTargetingsDevice {
  id: string;
  hasNested: boolean;
  data: IResultFullDataCampaignDataTargetingsDeviceData;
}

interface IResultFullDataCampaignDataTargetingsNetworkData {
  blacklist: string;
  whitelist: string;
  type: string;
  err: any[];
}

export interface IResultFullDataCampaignDataTargetingsNetwork {
  id: string;
  hasNested: boolean;
  data: IResultFullDataCampaignDataTargetingsNetworkData;
}

interface IResultFullDataCampaignDataTargetingsIspData {
  connectionTypes: { title: string; checked: boolean }[];
  operators: any[]; // TODO: узнать тип
  include: number;
}

export interface IResultFullDataCampaignDataTargetingsIsp {
  id: string;
  hasNested: boolean;
  data: IResultFullDataCampaignDataTargetingsIspData;
}

interface IResultFullDataCampaignDataTargetingsAudienceData {
  audience: any[];
  targer: number;
}

export interface IResultFullDataCampaignDataTargetingsAudience {
  id: string;
  hasNested: boolean;
  data: IResultFullDataCampaignDataTargetingsAudienceData;
}

export interface IResultFullDataCampaignDataTargetingsDefault {
  id: string;
  data: IResultFullDataCampaignDataTargetingsData[];
}

interface IResultFullDataCampaignDataTargetingsDataGeo {
  countries: IResultFullDataCampaignDataTargetingsDataItem[];
  cities: IResultFullDataCampaignDataTargetingsDataItem[];
  regions: IResultFullDataCampaignDataTargetingsDataItem[];
}

export interface IResultFullDataCampaignDataTargetingsGeo {
  id: string;
  data: IResultFullDataCampaignDataTargetingsDataGeo;
}

interface IResultFullDataCampaignDataTargetingsDataTime {
  id: string;
  data: boolean | number[];
}

export interface IResultFullDataCampaignDataTargetingsTime {
  id: string;
  params: { timezone: string };
  data: IResultFullDataCampaignDataTargetingsDataTime[];
}

export type IResultFullDataCampaignDataTargeting =
  | IResultFullDataCampaignDataTargetingsGeo
  | IResultFullDataCampaignDataTargetingsDefault
  | IResultFullDataCampaignDataTargetingsIsp
  | IResultFullDataCampaignDataTargetingsDevice
  | IResultFullDataCampaignDataTargetingsNetwork
  | IResultFullDataCampaignDataTargetingsAudience
  | IResultFullDataCampaignDataTargetingsTime;

export interface IResultFullDataCreativeData {
  id: string;
  adFormatId: string;
  adCampaignId: string;
  name: string;
  urlTemplate: string;
  targetDomain: string;
  comment: string;
  status: string;
  bannerHtml: string;
  code: string;
  timeCreated: string;
  moderationStatus: string;
  brandingBackground: string;
  adPricingModel: string;
  adOriginType: string;
  moderatorId: string;
  moderationStarted: string;
  moderationFinished: string;
  suspicious: number;
  suspiciousReason: string;
  creativeActions: string;
  adCalculationModel: string;
  isStartAfterApproved: string; // кгт фаеук ьщвукфешщт
  pushTypeImage: string;
  pushTypeInPage: string;
  rejections: any[];
  denyReturnToRemoderation: boolean;
  formatType: string;
  format: string;
  limitCounters: IResultFullDataCampaignDataLimitCounters;
  limits: IResultFullDataCampaignDataLimits;
  targetSourceId: IResultFullDataCampaignDataTargetSources;
  adPricingRate: string;
  canUpdateActive: boolean;
  targetings: IResultFullDataCampaignDataTargeting[];
}

export interface IResultFullDataCampaignDataLead {
  id: number;
  pos: number;
  name: string;
  mainLeadFlag: boolean;
  urlTemplate: string;
  price: number;
}

export interface IResultFullDataCampaignData {
  id: string;
  name: string;
  urlTemplate: string;
  targetDomain: string;
  status: string;
  comment: string;
  clickRedirectMode: string;
  campaignOriginType: string;
  feedId: string;
  feedName: string;
  dailyLeadsLimit: number;
  notes: string;
  resetUrl: boolean;
  adCampaign: { limitUpdated: boolean; _tableName_: string };
  limitCounters: IResultFullDataCampaignDataLimitCounters;
  limits: IResultFullDataCampaignDataLimits;
  leads: IResultFullDataCampaignDataLead[];
  NoRedirectHrefs: any[]; // TODO: высняить что вместо any
  domainBlacklist: string;
}

export interface IResultFullDataCampaign {
  code: number;
  campaign: IResultFullDataCampaignData;
  creative: IResultFullDataCreativeData;
}

export default class FullDataCampaign {
  constructor(readonly _value: IResultFullDataCampaign) {}

  get value(): IResultFullDataCampaign {
    return this._value;
  }
}
