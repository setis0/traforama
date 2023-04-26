import BidCampaign from "./BidCampaign";
import BrowserVersionCampaign from "./BrowserVersionCampaign";
import CampaignIdCampaign from "./IdCampaign";
import CountryCampaign from "./CountryCampaign";
import NameCampaign from "./NameCampaign";
import PlacementCampaign from "./PlacementCampaign";
import SourceIdCampaign from "./SourceIdCampaign";
import StageCampaign from "./StageCampaign";
import StatusCampaign from "./StatusCampaign";
import TargetUrlCampaign from "./TargetUrlCampaign";
import TemplateIdCampaign from "./TemplateIdCampaign";
import IdCampaign from "./IdCampaign";
import ResponceApiNetwork from "./ResponceApiNetwork";
import ScheduleCampaign from "./ScheduleCampaign";

export default interface ICampaign {
    id?: IdCampaign;
    status?: StatusCampaign;
    template_id: TemplateIdCampaign;
    // source_id: SourceIdCampaign;
    name: NameCampaign;
    country: CountryCampaign,
    // stage: StageCampaign,
    bid: BidCampaign,
    target_url: TargetUrlCampaign;
    placements_data: PlacementCampaign;
    schedule: ScheduleCampaign;
    browser_version: BrowserVersionCampaign;
}