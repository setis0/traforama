import { IAddDataCampaign } from './AddDataCampaign';

export interface IUpdateDataCampaign extends IAddDataCampaign {
  id: string;
}

export default class UpdateDataCampaign {
  constructor(readonly _value: IUpdateDataCampaign) {}

  get value(): IUpdateDataCampaign {
    return this._value;
  }

  setName(name: string): UpdateDataCampaign {
    this._value.name = name;
    return this;
  }

  setBid(bid: number): UpdateDataCampaign {
    this._value.bid = bid;
    return this;
  }

  setCountry(country: string): UpdateDataCampaign {
    this._value.targetings.countries = { value: [country], mode: true };
    return this;
  }

  setPLacements(placements: { list: any[]; type: boolean }): UpdateDataCampaign {
    const { list, type } = placements;
    this._value.targetings.spots = {
      value: list,
      mode: !type
    };
    return this;
  }

  prepare(): UpdateDataCampaign {
    const v: any = this._value;
    // delete v.id;
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
