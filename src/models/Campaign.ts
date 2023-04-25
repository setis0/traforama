import BidCampaign from "./BidCampaign";
import CampaignIdCampaign from "./IdCampaign";
import CountryCampaign from "./CountryCampaign";
import ICampaign from "./ICampaign";
import NameCampaign from "./NameCampaign";
import NetworkConnection from "./NetworkConnection";
import PlacementCampaign from "./PlacementCampaign";
import SourceIdCampaign from "./SourceIdCampaign";
import StageCampaign from "./StageCampaign";
import StatusCampaign from "./StatusCampaign";
import TargetUrlCampaign from "./TargetUrlCampaign";
import TemplateIdCampaign from "./TemplateIdCampaign";
import BrowserVersionCampaign from "./BrowserVersionCampaign";
import IdCampaign from "./IdCampaign";
import ResultUpdatePlacementCampaign from "./ResponceApiNetwork";
import SucResUpdPlcmtCampaign from "./ResponceApiNetwork";
import ResUpdPlcmtCampaign from "./ResponceApiNetwork";
import ResultUpdatePlacementsCampaign from "./ResponceApiNetwork";
import ResponceUpdatePlacementsCampaign from "./ResponceApiNetwork";
import ResponceApiNetwork from "./ResponceApiNetwork";

export default abstract class Campaign implements ICampaign {
    id: CampaignIdCampaign;
    status: StatusCampaign;
    template_id: TemplateIdCampaign;
    name: NameCampaign;
    country: CountryCampaign;
    bid: BidCampaign;
    target_url: TargetUrlCampaign;
    placements_data: PlacementCampaign;
    browser_version: BrowserVersionCampaign;
    protected conn: NetworkConnection;

    protected constructor(conn: NetworkConnection, data?: ICampaign) {
        this.conn = conn;

        this.id = new CampaignIdCampaign(null);
        this.status = new StatusCampaign();
        this.name = data?.name ?? new NameCampaign();
        this.target_url = data?.target_url ?? new TargetUrlCampaign();
        this.template_id = data?.template_id ?? new TemplateIdCampaign();
        this.placements_data = data?.placements_data ?? new PlacementCampaign();
        this.country = data?.country ?? new CountryCampaign();
        this.browser_version = data?.browser_version ?? new BrowserVersionCampaign();
        this.bid = data?.bid ?? new BidCampaign();

    }

    /**
     * Создание кампании
     * @param conn 
     * @param data 
     */
    static create(conn: NetworkConnection, data: ICampaign): Promise<ResponceApiNetwork> {
        throw new Error("Method not implemented.");
    }

    /**
     * Получить данные кампании из сети
     * @param id 
     */
    static fetch(conn: NetworkConnection, id: IdCampaign): Promise<Campaign> {
        throw new Error("Method not implemented.");
    }

    /**
     * Обновление площадок в кампании
     */
    abstract updatePlacements(data: PlacementCampaign): Promise<ResponceApiNetwork>;

    /**
     * Удаление кампании
     */
    abstract remove(): Promise<ResponceApiNetwork>;

    /**
     * Запуск кампании
     */
    abstract start(): Promise<ResponceApiNetwork>;

    /**
     * Запуск кампании
     */
    abstract stop(): Promise<ResponceApiNetwork>;
}