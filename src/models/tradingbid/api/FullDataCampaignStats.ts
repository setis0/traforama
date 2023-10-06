export interface IResultFullDataCampaignStatsDataItemUsing {
  name: string;
  filter?: any;
}

export interface IResultFullDataCampaignStatsDataItemTableColumn {
  name: string;
  filter?: any;
}

export interface IResultFullDataCampaignStatsDataItemStat {
  impAdCampaignId: string;
  impSourceHash: string;
  eventView: string;
  advertiserAllPayments: string;
  eventClick: string;
  ctr: string;
  allLeadsCount: string;
  eventLead1: string;
  eventLead2: string;
  eventLead3: string;
  eventLead4: string;
  eventLead5: string;
  date: string;
}

export interface IResultFullDataCampaignStatsDataItem {
  date: { start: string; end: string; hours: any[]; datePeriod: string };
  diff: { sort: string; percent: string; date: string };
  using: IResultFullDataCampaignStatsDataItemUsing[];
  notUsing: IResultFullDataCampaignStatsDataItemUsing[];
  table: {
    columns: IResultFullDataCampaignStatsDataItemTableColumn[];
    sort: string[][];
    pagination: { page: number; total: number };
    data: IResultFullDataCampaignStatsDataItemStat[];
  };
  templateId: string;
  reportId: string;
}

interface IResultFullDataCampaignStats {
  code: number;
  data: IResultFullDataCampaignStatsDataItem;
}

export default class FullDataCampaignStats {
  constructor(readonly _value: IResultFullDataCampaignStats) {}

  get value(): IResultFullDataCampaignStats {
    return this._value;
  }
}
