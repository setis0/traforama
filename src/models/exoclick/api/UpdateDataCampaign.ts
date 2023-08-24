import { IUpdateDataCampaignDayParting } from './FullDataCampaign';

interface IUpdateDataCampaignCountries {
  type: 'targeted';
  elements: { country: string }[];
}

interface IUpdateDataCampaignPricing {
  model: number;
  price: number;
}

export interface IUpdateDataCampaignZone {
  idzone: number;
  price: number;
}

export interface IUpdateDataCampaignZoneTargeting {
  type: number;
  network_selection: number;
  partner_networks: number;
}

interface IUpdateDataCampaign {
  id?: number;
  name?: string;
  status: number;
  countries?: IUpdateDataCampaignCountries;
  pricing?: IUpdateDataCampaignPricing;
  zones?: IUpdateDataCampaignZone[];
  zone_targeting?: IUpdateDataCampaignZoneTargeting;
  day_parting?: IUpdateDataCampaignDayParting[];
}

export default class UpdateDataCampaign {
  constructor(readonly _value: IUpdateDataCampaign) {}

  get value(): IUpdateDataCampaign {
    return this._value;
  }

  setId(id: number): UpdateDataCampaign {
    this._value.id = id;
    return this;
  }

  setName(name: string): UpdateDataCampaign {
    this._value.name = name;
    return this;
  }

  setStatus(status: number): UpdateDataCampaign {
    this._value.status = status;
    return this;
  }

  /**
   *
   * @param country iso3
   */
  setCountry(country: string): UpdateDataCampaign {
    if (this._value.countries) this._value.countries.elements = [{ country }];
    return this;
  }

  setPricing(pricing: IUpdateDataCampaignPricing): UpdateDataCampaign {
    this._value.pricing = pricing;
    return this;
  }
}
