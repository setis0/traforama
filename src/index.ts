import Exoclick from './models/exoclick/Exoclick';
import ExoclickAccount from './models/exoclick/ExoclickAccount';
import ExoclickCampaign from './models/exoclick/ExoclickCampaign';

import {
  TemplateIdCampaign,
  TargetUrlCampaign,
  ScheduleCampaign,
  PlacementCampaign,
  NameCampaign,
  IdCampaign,
  CountryCampaign,
  BrowserVersionCampaign,
  BidCampaign
} from '@atsorganization/ats-lib-ntwk-common';

export {
  BrowserVersionCampaign as BrowserVersionCampaign,
  TargetUrlCampaign as TargetUrlCampaign,
  TemplateIdCampaign as TemplateIdCampaign,
  NameCampaign as NameCampaign,
  CountryCampaign as CountryCampaign,
  BidCampaign as BidCampaign,
  IdCampaign as IdCampaign,
  ExoclickCampaign as Campaign,
  PlacementCampaign as PlacementCampaign,
  ScheduleCampaign as ScheduleCampaign,
  ExoclickAccount as Account
};

export default Exoclick;
