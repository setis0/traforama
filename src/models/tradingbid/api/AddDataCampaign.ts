import FullDataCampaign, {
  IResultFullDataCampaignDataLead,
  IResultFullDataCampaignDataLimits
} from './FullDataCampaign';

export interface IAddDataCampaign {
  type: string;
  modeUi: string;
  id: string | null;
  name: string;
  feedId: string | null;
  feedName: string | null;
  urlTemplate: string;
  resetUrl: boolean;
  targetDomain: string | null;
  clickRedirectMode: string;
  campaignOriginType: string | null;
  comment: string;
  limits: IResultFullDataCampaignDataLimits;
  leads: IResultFullDataCampaignDataLead[];
  errors: any; // TODO; выяснить что вместо any
  NoRedirectHrefs: any[]; // TODO; выяснить что вместо any
  selectedAudiences: any[]; // TODO; выяснить что вместо any
  collectClicked: boolean;
  collectConverted: boolean;
  collectInterested: boolean;
  domainBlacklist: string;
  dailyLeadsLimit: string;
  notes: string;
}

export default class AddDataCampaign {
  constructor(readonly _value: IAddDataCampaign) {}

  get value(): IAddDataCampaign {
    return this._value;
  }

  setName(name: string): AddDataCampaign {
    this._value.name = name;
    return this;
  }
  setTargeturl(targetUrl: string): AddDataCampaign {
    this._value.urlTemplate = targetUrl;
    return this;
  }

  static fromFullDataCampaign(fullDataCampaign: FullDataCampaign): AddDataCampaign {
    const {
      campaign: {
        name,
        feedId,
        feedName,
        urlTemplate,
        resetUrl,
        targetDomain,
        clickRedirectMode,
        campaignOriginType,
        comment,
        limits,
        leads,
        NoRedirectHrefs,
        domainBlacklist,
        dailyLeadsLimit,
        notes
      }
    } = fullDataCampaign.value;
    return new AddDataCampaign({
      type: 'campaigns',
      modeUi: 'simple',
      id: null,
      name,
      feedId,
      feedName,
      urlTemplate,
      resetUrl,
      targetDomain,
      clickRedirectMode,
      campaignOriginType,
      comment,
      limits,
      leads,
      errors: {},
      NoRedirectHrefs,
      selectedAudiences: [],
      collectClicked: false,
      collectConverted: false,
      collectInterested: false,
      domainBlacklist,
      dailyLeadsLimit: String(dailyLeadsLimit),
      notes
    });
  }
}
