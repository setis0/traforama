import AddDataCampaign from './AddDataCampaign';
import FullDataCampaign, {
  IResultFullDataCampaignDataLead,
  IResultFullDataCampaignDataLimits,
  IResultFullDataCampaignDataTargetSources,
  IResultFullDataCampaignDataTargeting,
  IResultFullDataCampaignDataTargetingsDataItem
} from './FullDataCampaign';

interface IResultFullDataCampaignDataTargetingsDataItemCountry extends IResultFullDataCampaignDataTargetingsDataItem {
  titleEn: string;
}

export interface IAddDataCreative {
  type: string;
  modeUi: string;
  id: string | null;
  adFormatId: number;
  adCampaignId: string;
  adPricingModel: string;
  adOriginType: string;
  name: string;
  urlTemplate: string;
  targetDomain: string | null;
  comment: string;
  bannerHtml: string;
  banner: any; // TODO; выяснить что вместо any
  htmlFile: any; // TODO; выяснить что вместо any
  branding1: any; // TODO; выяснить что вместо any
  branding2: any; // TODO; выяснить что вместо any
  branding3: any; // TODO; выяснить что вместо any
  push1: any; // TODO; выяснить что вместо any
  push2: any; // TODO; выяснить что вместо any
  pwaIcon: any; // TODO; выяснить что вместо any
  video: any; // TODO; выяснить что вместо any
  brandingBgColor: string;
  npTitle: string;
  npAdText: string;
  npActions: any[]; // TODO; выяснить что вместо any
  pwaTitle: string;
  pwaAdText: string;
  pwaAfterInstallUrl: string;
  pushType: string | null;
  formatType: string;
  pushTypeImage: string;
  pushTypeInPage: string;
  bannerType: string;
  leads: IResultFullDataCampaignDataLead[];
  links: any[];
  limits: IResultFullDataCampaignDataLimits;
  isStartAfterApproved: boolean;
  errors: any; // TODO; выяснить что вместо any
  adPricingRate: number;
  targetSourceId: IResultFullDataCampaignDataTargetSources;
  targetings: IResultFullDataCampaignDataTargeting[];
}

export default class AddDataCreative {
  constructor(readonly _value: IAddDataCreative) {}

  get value(): IAddDataCreative {
    return this._value;
  }

  setName(name: string): AddDataCreative {
    this._value.name = name;
    return this;
  }

  setTargeturl(targetUrl: string): AddDataCreative {
    this._value.urlTemplate = targetUrl;
    return this;
  }

  setBid(bid: number): AddDataCreative {
    this._value.adPricingRate = bid;
    return this;
  }

  setCountry(country: IResultFullDataCampaignDataTargetingsDataItemCountry): AddDataCreative {
    const targetings: any = this._value.targetings;
    targetings.forEach((el: any) => {
      if (el.id === 'geo') {
        el.data.countries = [country];
      }
    });
    return this;
  }

  setCampaignId(campaignId: string): AddDataCreative {
    this._value.adCampaignId = campaignId;
    return this;
  }

  static fromFullDataCampaign(fullDataCampaign: FullDataCampaign): AddDataCreative {
    const {
      creative: {
        name,
        urlTemplate,
        adPricingModel,
        adOriginType,
        adFormatId,
        adCampaignId,
        targetDomain,
        comment,
        bannerHtml,
        limits,
        formatType,
        pushTypeImage,
        pushTypeInPage,
        isStartAfterApproved,
        adPricingRate,
        targetSourceId,
        targetings
      }
    } = fullDataCampaign.value;
    // console.log(fullDataCampaign.value.creative);
    return new AddDataCreative({
      type: 'creatives',
      modeUi: 'simple',
      id: null,
      adFormatId: Number(adFormatId),
      adCampaignId,
      adPricingModel,
      adOriginType,
      name,
      urlTemplate,
      targetDomain,
      comment,
      bannerHtml,
      banner: {},
      htmlFile: {},
      branding1: {},
      branding2: {},
      branding3: {},
      push1: {},
      push2: {},
      pwaIcon: {},
      video: {},
      brandingBgColor: '',
      npTitle: '',
      npAdText: '',
      npActions: [],
      pwaTitle: '',
      pwaAdText: '',
      pwaAfterInstallUrl: '',
      pushType: null,
      formatType,
      pushTypeImage,
      pushTypeInPage,
      bannerType: '',
      leads: [],
      links: [],
      limits,
      isStartAfterApproved: !!isStartAfterApproved,
      errors: {},
      adPricingRate: Number(adPricingRate),
      targetSourceId,
      targetings
    });
  }
}
