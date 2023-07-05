import Clickadu from './models/clickadu/Clickadu';
import ClickaduAccount from './models/clickadu/ClickaduAccount';
import ClickaduCampaign from './models/clickadu/ClickaduCampaign';

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
  ClickaduCampaign as Campaign,
  PlacementCampaign as PlacementCampaign,
  ScheduleCampaign as ScheduleCampaign,
  ClickaduAccount as Account
};

export default Clickadu;
