import Exoclick from './models/clickadu/Exoclick';
import ExoclickAccount from './models/clickadu/ExoclickAccount';
import ExoclickCampaign from './models/clickadu/ExoclickCampaign';
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
