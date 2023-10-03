import { IAddDataCampaign } from './AddDataCampaign';
import { IAddDataCreative } from './AddDataCreative';
import FullDataCampaign from './FullDataCampaign';

export interface IUpdateDataCreative extends IAddDataCreative {}

export default class UpdateDataCreative {
  constructor(readonly _value: IUpdateDataCreative) {}

  get value(): IUpdateDataCreative {
    return this._value;
  }

  setPLacements(placements: { list: any[]; type: boolean }): UpdateDataCreative {
    const { list, type } = placements;
    this._value.targetSourceId.data = list.join(',');
    this._value.targetSourceId.type = type ? 'blacklist' : 'whitelist';
    return this;
  }

  static fromFullDataCampaign(fullDataCampaign: FullDataCampaign): UpdateDataCreative {
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
        targetings,
        id
      }
    } = fullDataCampaign.value;
    return new UpdateDataCreative({
      type: 'creatives',
      modeUi: 'simple',
      id,
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
