import TradingBid from './models/tradingbid/TradingBid';
import TrendingBidAccount from './models/tradingbid/TrendingBidAccount';
import TrendingBidCampaign from './models/tradingbid/TrendingBidCampaign';

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
  TrendingBidCampaign as Campaign,
  PlacementCampaign as PlacementCampaign,
  ScheduleCampaign as ScheduleCampaign,
  TrendingBidAccount as Account
};

export default TradingBid;
