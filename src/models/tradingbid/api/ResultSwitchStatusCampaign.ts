import { IResultFullDataCreativeData } from './FullDataCampaign';

interface IResultSwitchStatusCampaign {
  code: number;
  data: any[];
}

export default class ResultSwitchStatusCampaign {
  constructor(readonly _value: IResultSwitchStatusCampaign) {}

  get value(): IResultSwitchStatusCampaign {
    return this._value;
  }
}
