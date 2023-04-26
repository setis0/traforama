import BidCampaign from "./BidCampaign";
import CampaignIdCampaign from "./IdCampaign";
import CountryCampaign from "./CountryCampaign";
import ICampaign from "./ICampaign";
import NameCampaign from "./NameCampaign";
import NetworkConnection from "./NetworkConnection";
import PlacementCampaign from "./PlacementCampaign";
import SourceIdCampaign from "./SourceIdCampaign";
import StageCampaign from "./StageCampaign";
import StatusCampaign, { status } from "./StatusCampaign";
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
import { ERROR_NOT_SET_ID_CAMPAIGN } from "../consts";
import FullDataCampaign from "./clickadu/api/FullDataCampaign";
import ScheduleCampaign from "./ScheduleCampaign";

export default abstract class Campaign implements ICampaign {
    id: IdCampaign;
    status: StatusCampaign;
    template_id: TemplateIdCampaign;
    name: NameCampaign;
    country: CountryCampaign;
    bid: BidCampaign;
    target_url: TargetUrlCampaign;
    placements_data: PlacementCampaign;
    browser_version: BrowserVersionCampaign;
    schedule: ScheduleCampaign;
    protected conn: NetworkConnection;


    constructor(conn: NetworkConnection) {
        this.conn = conn;
        this.id = new IdCampaign();
        this.status = new StatusCampaign();
        this.name = new NameCampaign();
        this.target_url = new TargetUrlCampaign();
        this.template_id = new TemplateIdCampaign();
        this.placements_data = new PlacementCampaign();
        this.country = new CountryCampaign();
        this.browser_version = new BrowserVersionCampaign();
        this.schedule = new ScheduleCampaign();
        this.bid = new BidCampaign();
    }


    /**
     * Утсановка id кампании
     * @param id 
     * @returns 
     */
    setId(id: IdCampaign): Campaign {
        this.id = id;
        return this;
    }

    /**
     * Утсановка статуса кампании
     * @param status 
     * @returns 
     */
    setStatus(status: StatusCampaign): Campaign {
        this.status = status;
        return this;
    }

    /**
     * Установка
     * @param template_id 
     * @returns 
     */
    setTemplateId(template_id: TemplateIdCampaign): Campaign {
        this.template_id = template_id;
        return this;
    };

    /**
     * Установка имени кампании
     * @param name 
     * @returns 
     */
    setName(name: NameCampaign): Campaign {
        this.name = name;
        return this;
    }

    /**
    * Установка страны кампании
    * @param country 
    * @returns 
    */
    setCountry(country: CountryCampaign): Campaign {
        this.country = country;
        return this;
    }

    /**
     * Установка ставки кампании
     * @param bid 
     * @returns 
     */
    setBid(bid: BidCampaign): Campaign {
        this.bid = bid;
        return this;
    }


    /**
     * Установка target_url кампании
     * @param target_url 
     * @returns 
     */
    setTargetUrl(target_url: TargetUrlCampaign): Campaign {
        this.target_url = target_url;
        return this;
    }

    /**
      * Установка placements_data кампании
      * @param placements_data 
      * @returns 
      */
    setPlacementsData(placements_data: PlacementCampaign): Campaign {
        this.placements_data = placements_data;
        return this;
    }

    /**
      * Установка browser_version кампании
      * @param browser_version 
      * @returns 
      */
    setBrowserVersion(browser_version: BrowserVersionCampaign): Campaign {
        this.browser_version = browser_version;
        return this;
    }

    /**
      * Установка расписания кампании
      * @param browser_version 
      * @returns 
      */
    setSchedule(schedule: ScheduleCampaign): Campaign {
        this.schedule = schedule;
        return this;
    }

    /**
     * ОБработка ошибки не указнного ID кампании
     */
    handlerErrNotIdCampaign(): void {
        if (!this.id?.value) throw new Error(ERROR_NOT_SET_ID_CAMPAIGN);
    }

    /**
     * Обновление кампании 
     * @param data 
     */
    protected abstract updateRaw(data: FullDataCampaign): Promise<any>;

    /**
     * ПОлучение статуса кампании
     */
    abstract getStatus(): Promise<StatusCampaign>;

    /**
     * Установка расписания капаснии
     */
    abstract updateSchedule(schedule: ScheduleCampaign): Promise<ResponceApiNetwork>;

    /**
     * Создание кампании
     * @param conn 
     * @param data 
     */
    abstract create(data: ICampaign, schedule: ScheduleCampaign): Promise<ResponceApiNetwork>;

    /**
     * Получить данные кампании из сети
     * @param id 
     */
    abstract fetch(): Promise<ResponceApiNetwork>;

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