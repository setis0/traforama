import { IResultFullDataCreativeData } from './FullDataCampaign';

interface IResultAddCreative {
  code: number;
  data: IResultFullDataCreativeData;
}

export default class ResultAddCreative {
  constructor(readonly _value: IResultAddCreative) {}

  get value(): IResultAddCreative {
    return this._value;
  }
}
