import BidCampaign from "./BidCampaign";
import BrowserVersionCampaign from "./BrowserVersionCampaign";
import CountryCampaign from "./CountryCampaign";
import NameCampaign from "./NameCampaign";
import PlacementCampaign from "./PlacementCampaign";
import StatusCampaign from "./StatusCampaign";
import TargetUrlCampaign from "./TargetUrlCampaign";
import TemplateIdCampaign from "./TemplateIdCampaign";
import IdCampaign from "./IdCampaign";
import ScheduleCampaign from "./ScheduleCampaign";
export default interface ICampaign {
    id?: IdCampaign;
    status?: StatusCampaign;
    template_id: TemplateIdCampaign;
    name: NameCampaign;
    country: CountryCampaign;
    bid: BidCampaign;
    target_url: TargetUrlCampaign;
    placements_data: PlacementCampaign;
    schedule: ScheduleCampaign;
    browser_version: BrowserVersionCampaign;
}
