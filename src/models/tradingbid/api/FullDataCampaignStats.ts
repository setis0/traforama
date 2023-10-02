export interface IResultFullDataCampaignStatsDataItem {
  spot: { id: string; value: string };
  impressions: number;
  cost: number;
}

interface IResultFullDataCampaignStats {
  status_code: number;
  meta: {
    show: number;
    total: number;
    has_more: boolean;
    offset: number;
    current_page: number;
    total_pages: number;
    limit: number;
  };
  data: IResultFullDataCampaignStatsDataItem[];
}

export default class FullDataCampaignStats {
  constructor(readonly _value: IResultFullDataCampaignStats) {}

  get value(): IResultFullDataCampaignStats {
    return this._value;
  }
}
