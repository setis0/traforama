import { IUpdateDataCampaignZone, IUpdateDataCampaignZoneTargeting } from './UpdateDataCampaign';

export interface IResultFullDataCampaignVariation {
  idvariation: number;
  name: string;
  url: string;
  calculated_status: string;
}

interface IResultFullDataCampaignRawCalculatedStatus {
  id: number;
  status: string;
}

interface IResultFullDataCampaignRaw {
  id: string;
  name: string;
  status: number;
  calculated_status: IResultFullDataCampaignRawCalculatedStatus;
  pricing_model: number;
  price: number;
}

export interface IResultFullDataCampaignCountryItem {
  id: number;
  short_name: string;
  long_name: string;
  iso2: string;
  iso3: string;
  is_eu_member: 0;
  has_vat_exemption_territories: 0;
}

export interface IResultFullDataCampaignCountry {
  targeted?: IResultFullDataCampaignCountryItem[];
  blocked?: IResultFullDataCampaignCountryItem[];
}

export interface IUpdateDataCampaignDayParting {
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  hours: number[];
}

interface IResultFullDataCampaign {
  campaign: IResultFullDataCampaignRaw;
  variations: IResultFullDataCampaignVariation[];
  countries: IResultFullDataCampaignCountry;
  zones: IUpdateDataCampaignZone[];
  zone_targeting: IUpdateDataCampaignZoneTargeting;
  day_parting: IUpdateDataCampaignDayParting[];
}

export default class FullDataCampaign {
  constructor(readonly _value: IResultFullDataCampaign) {}

  get value(): IResultFullDataCampaign {
    return this._value;
  }
}
