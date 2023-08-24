interface IResultFullDataCampaignCategoriesInterest {
  type: string;
  elements: [
    {
      main_category_id: number;
      category_ids: [number];
    }
  ];
}
interface IResultFullDataCampaignIpRanges {
  targeted: [
    {
      ip_range: string;
    }
  ];
  blocked: [
    {
      ip_range: string;
    }
  ];
}
interface IResultFullDataCampaignKeywords {
  targeted: [
    {
      keyword: string;
    }
  ];
  blocked: [
    {
      keyword: string;
    }
  ];
}
interface IResultFullDataCampaignVariations {
  idvariation: number;
  name: string;
  description: string;
  active: number;
  status: number;
  url: string;
  imgurl: string;
  durl: string;
  offer_id: string;
  offer_name: string;
  idvariations_file: number;
  idvariations_url: number;
  idvariations_html: number;
  idvariations_iframe_url: number;
  verification_statuses: {
    creative: number;
    urls: {
      [url: string]: {
        id: number;
        status: number;
        is_explicit: number;
      };
    };
  };
  is_explicit: number;
  click_url: string;
  share: number;
  brand: string;
  calculated_status: string;
  crop_anchor_point: number;
}
interface IResultFullDataCampaignZoneTargeting {
  type: number;
  network_selection: number;
  partner_networks: number;
}
interface IResultFullDataCampaignZones {
  idzone: number;
  price: number;
  sub_id_target_type: number;
  sub_ids: [number];
}
interface IResultFullDataCampaignRetargeting {
  idgoal: number;
  type: number;
}
interface IResultFullDataCampaignSiteTargeting {
  idsite: number;
  exclude: [
    {
      idzone: number;
    }
  ];
}
interface IResultFullDataCampaignSites {
  targeted: [
    {
      url: string;
    }
  ];
  blocked: [
    {
      url: string;
    }
  ];
}
interface IResultFullDataCampaignDayParting {
  day: number;
  hours: [number];
}
interface IResultFullDataCampaignOperatingSystems {
  targeted: [
    {
      id: number;
      name: string;
      operating_system_type: {
        id: number;
        name: string;
      };
      status: number;
    }
  ];
  blocked: [
    {
      id: number;
      name: string;
      operating_system_type: {
        id: number;
        name: string;
      };
      status: number;
    }
  ];
}
interface IResultFullDataCampaignCategories {
  targeted: [
    {
      id: number;
      name: string;
      long_name: string;
      parent: string;
      selectable: number;
    }
  ];
  blocked: [
    {
      id: number;
      name: string;
      long_name: string;
      parent: string;
      selectable: number;
    }
  ];
}
interface IResultFullDataCampaignCarriers {
  targeted: [
    {
      id: number;
      name: string;
      country_id: number;
      enabled: number;
    }
  ];
  blocked: [
    {
      id: number;
      name: string;
      country_id: number;
      enabled: number;
    }
  ];
}
interface IResultFullDataCampaignCountries {
  targeted: [
    {
      id: number;
      short_name: string;
      long_name: string;
      iso2: string;
      iso3: string;
      is_eu_member: number;
      has_vat_exemption_territories: number;
    }
  ];
}
interface IResultFullDataCampaignLanguages {
  targeted: [
    {
      id: number;
      name: string;
      iso2: string;
      iso2_two: string;
    }
  ];
  blocked: [
    {
      id: number;
      name: string;
      iso2: string;
      iso2_two: string;
    }
  ];
}
interface IResultFullDataCampaignBrowsers {
  targeted: [
    {
      id: number;
      name: string;
      status: number;
    }
  ];
  blocked: [
    {
      id: number;
      name: string;
      status: number;
    }
  ];
}
interface IResultFullDataCampaignDevices {
  targeted: [
    {
      id: number;
      name: string;
      device_type: {
        id: number;
        name: string;
      };
    }
  ];
  blocked: [
    {
      id: number;
      name: string;
      device_type: {
        id: number;
        name: string;
      };
    }
  ];
}
interface IResultFullDataCampaignPublisherAdTypes {
  id: number;
  name: string;
  is_virtual: boolean;
  is_multi_format_enabled: boolean;
  ad_group: {
    id: number;
    name: string;
  };
  pricing_models: [number];
  sizes: [string];
  responsive_zones_enabled: [string];
  available_advanced_filters: [string];
}
interface IResultFullDataCampaignCampaign {
  id: number;
  name: string;
  is_editable: boolean;
  status: number;
  checked: number;
  idgroup: number;
  advertiser_ad_type: number;
  media_storage_template: string;
  size: string;
  pricing_model: number;
  campaign_type: {
    id: number;
    name: string;
  };
  type: number;
  rejecting_reason: number;
  rejecting_reason_details: {
    id: number;
    name: string;
    custom_rejecting_reason: string;
  };
  parting_timezone: number;
  percentage: number;
  start_date: string;
  end_date: string;
  total_impressions: number;
  impressions_sent: number;
  total_budget_limit: number;
  total_budget_spent: number;
  budget_delivery_mode: number;
  daily_limit_type: number;
  daily_limit_delivery_mode: number;
  max_daily_budget: number;
  max_daily_budget_reset: number;
  max_daily_impressions: number;
  max_daily_impressions_reset: number;
  vr: number;
  capping: {
    quantity: number;
    frequency: number;
  };
  price: number;
  calculated_status: {
    id: number;
    status: string;
  };
  variations_counts: {
    number_of_variations: number;
    number_of_valid_variations: number;
    number_of_pending_variations: number;
    number_of_rejected_variations: number;
    number_of_paused_variations: number;
  };
  optimization_rule: number;
  is_deprecated: number;
  advertiser_ad_type_label: string;
  blocked_zones: {};
  optimization_algorithm: number;
  optimization_idgoal: string;
  variation_language: string;
  idad_exchange_partner: number;
  is_internal: number;
  is_title_enabled: number;
  email_passing: boolean;
  run_on_responsive_zones: number;
  allowed_throttling_down: number;
  allowed_maximize_target: number;
  idgoal_target: number;
  bidding_strategy: number;
  target_roas: number;
}

interface IResultFullDataCampaign {
  campaign: IResultFullDataCampaignCampaign;
  publisher_ad_types: [IResultFullDataCampaignPublisherAdTypes];
  devices: IResultFullDataCampaignDevices;
  browsers: IResultFullDataCampaignBrowsers;
  languages: IResultFullDataCampaignLanguages;
  countries: IResultFullDataCampaignCountries;
  carriers: IResultFullDataCampaignCarriers;
  categories: IResultFullDataCampaignCategories;
  operating_systems: IResultFullDataCampaignOperatingSystems;
  day_parting: [IResultFullDataCampaignDayParting];
  sites: IResultFullDataCampaignSites;
  site_targeting: IResultFullDataCampaignSiteTargeting;
  retargeting: [IResultFullDataCampaignRetargeting];
  zones: [IResultFullDataCampaignZones];
  zone_targeting: IResultFullDataCampaignZoneTargeting;
  variations: [IResultFullDataCampaignVariations];
  keywords: IResultFullDataCampaignKeywords;
  ip_ranges: IResultFullDataCampaignIpRanges;
  categories_interest: IResultFullDataCampaignCategoriesInterest;
}

export default class FullDataCampaign {
  constructor(readonly _value: IResultFullDataCampaign) {}

  get value(): IResultFullDataCampaign {
    return this._value;
  }

  setTargetUrl(newTargetUrl: string): FullDataCampaign {
    this._value.targetUrl = newTargetUrl;
    return this;
  }

  setId(newId: number): FullDataCampaign {
    this._value.campaign.id = newId;
    return this;
  }

  setName(newName: string): FullDataCampaign {
    this._value.name = newName;
    return this;
  }

  setRates(newRates: IResultFullDataCampaignRate[]): FullDataCampaign {
    this._value.rates = newRates;
    return this;
  }

  setStatus(newStatus: number): FullDataCampaign {
    this._value.status = newStatus;
    return this;
  }

  setTargetingCountry(newTargetingCountry: IResultFullDataCampaignElemTargeting): FullDataCampaign {
    this._value.targeting.country = newTargetingCountry;
    return this;
  }

  setTargetingTimeTable(newTargetingTimeTable: IResultFullDataCampaignSimpleElemTargeting): FullDataCampaign {
    this._value.targeting.timeTable = newTargetingTimeTable;
    return this;
  }

  setTargetingZone(
    newTargetingZone: IResultFullDataCampaignElemTargeting | IResultFullDataCampaignSimpleElemTargeting
  ): FullDataCampaign {
    this._value.targeting.zone = newTargetingZone;
    return this;
  }

  setTargetingConnection(newTargetingConnection: string): FullDataCampaign {
    this._value.targeting.connection = newTargetingConnection;
    return this;
  }

  setFreqCapType(newFreqCapType: string): FullDataCampaign {
    this._value.freqCapType = newFreqCapType;
    return this;
  }

  setTargetingBrowserVersion(newTargetingBrowserVersion: IResultFullDataCampaignElemTargeting): FullDataCampaign {
    this._value.targeting.browserVersion = newTargetingBrowserVersion;
    return this;
  }
}
