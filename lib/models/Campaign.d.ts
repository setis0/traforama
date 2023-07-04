import BidCampaign from "./BidCampaign";
import CountryCampaign from "./CountryCampaign";
import ICampaign from "./ICampaign";
import NameCampaign from "./NameCampaign";
import NetworkConnection from "./NetworkConnection";
import PlacementCampaign from "./PlacementCampaign";
import StatusCampaign from "./StatusCampaign";
import TargetUrlCampaign from "./TargetUrlCampaign";
import TemplateIdCampaign from "./TemplateIdCampaign";
import BrowserVersionCampaign from "./BrowserVersionCampaign";
import IdCampaign from "./IdCampaign";
import ResponceApiNetwork from "./ResponceApiNetwork";
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
    constructor(conn: NetworkConnection);
    /**
     * Утсановка id кампании
     * @param id
     * @returns
     */
    setId(id: IdCampaign): Campaign;
    /**
     * Утсановка статуса кампании
     * @param status
     * @returns
     */
    setStatus(status: StatusCampaign): Campaign;
    /**
     * Установка
     * @param template_id
     * @returns
     */
    setTemplateId(template_id: TemplateIdCampaign): Campaign;
    /**
     * Установка имени кампании
     * @param name
     * @returns
     */
    setName(name: NameCampaign): Campaign;
    /**
    * Установка страны кампании
    * @param country
    * @returns
    */
    setCountry(country: CountryCampaign): Campaign;
    /**
     * Установка ставки кампании
     * @param bid
     * @returns
     */
    setBid(bid: BidCampaign): Campaign;
    /**
     * Установка target_url кампании
     * @param target_url
     * @returns
     */
    setTargetUrl(target_url: TargetUrlCampaign): Campaign;
    /**
      * Установка placements_data кампании
      * @param placements_data
      * @returns
      */
    setPlacementsData(placements_data: PlacementCampaign): Campaign;
    /**
      * Установка browser_version кампании
      * @param browser_version
      * @returns
      */
    setBrowserVersion(browser_version: BrowserVersionCampaign): Campaign;
    /**
      * Установка расписания кампании
      * @param browser_version
      * @returns
      */
    setSchedule(schedule: ScheduleCampaign): Campaign;
    /**
     * ОБработка ошибки не указнного ID кампании
     */
    handlerErrNotIdCampaign(): void;
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
