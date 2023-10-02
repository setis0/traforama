import FullDataCampaign, {
  IResultFullDataCampaignDataLead,
  IResultFullDataCampaignDataLimits
} from './FullDataCampaign';

export type status = 'deleted' | 'active' | 'stopped';
export interface ISwitchStatusDataCampaign {
  campaigns: { type: string; include: number[]; exclude: number[] };
  status: status;
  showStopped: boolean;
  showDeleted: boolean;
}

export default class SwitchStatusDataCampaign {
  constructor(readonly _value: ISwitchStatusDataCampaign) {}

  get value(): ISwitchStatusDataCampaign {
    return this._value;
  }
}
