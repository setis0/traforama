import FullDataCampaign from './api/FullDataCampaign';
import { ScheduleCampaign, ResponceApiNetwork, StatusCampaign, PlacementCampaign, ICampaign, Campaign } from 'ats-lib-ntwk-common';
export default class ClickaduCampaign extends Campaign {
    /**
     * Создание кампании
     * @param conn
     * @param data
     * @returns
     */
    create(data: ICampaign, schedule?: ScheduleCampaign): Promise<ResponceApiNetwork>;
    /**
     * Подгттовка корректного статуса для API
     * @param data
     * @returns
     */
    private prepareStatus;
    /**
     * Устаноыка расписания кампании
     * по-умолчанию полное расписание
     * @param schedule
     */
    updateSchedule(schedule?: ScheduleCampaign): Promise<ResponceApiNetwork>;
    /**
     * вытянуть все данные по кампании из сети
     */
    fetch(): Promise<ResponceApiNetwork>;
    /**
     * обновлене кампании
     * @param data
     * @returns
     */
    protected updateRaw(data: FullDataCampaign): Promise<any>;
    /**
     * Получение полной информации по кампании из сети
     * @param campaignId
     * @returns
     */
    private getFullDataCampaign;
    /**
     * Клонирвоание кампании
     * @param campaignId
     * @returns
     */
    private clone;
    /**
     * Получение статуса кампани
     * @param id
     * @returns
     */
    getStatus(): Promise<StatusCampaign>;
    /**
     * Обновление площадок в кампании
     * @param data
     * @returns
     */
    updatePlacements(data: PlacementCampaign): Promise<ResponceApiNetwork>;
    /**
     * Удаление кампании
     */
    remove(): Promise<ResponceApiNetwork>;
    /**
     * Точеченое удаление кампании
     * @param id
     * @returns
     */
    private removeUnit;
    /**
     * Запуск кампании
     */
    start(): Promise<ResponceApiNetwork>;
    /**
     * Остановка кампании
     */
    stop(): Promise<ResponceApiNetwork>;
    /**
     * Отмена модерации
     * @param campaignId
     * @returns
     */
    private cancelModeration;
}
