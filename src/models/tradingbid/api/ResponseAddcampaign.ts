import { IResultFullDataCampaignData } from './FullDataCampaign';

export interface IResponseAddcampaign {
  code: number;
  data: IResultFullDataCampaignData;
}

export default class ResponseAddcampaign {
  constructor(readonly _value: IResponseAddcampaign) {}

  get value(): IResponseAddcampaign {
    return this._value;
  }
}
