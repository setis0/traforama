import { NetworkConnection, Campaign, Account } from '@atsorganization/ats-lib-ntwk-common';
export default class ClickaduConnection extends NetworkConnection {
    /**
     * Авторизация в сети
     * @returns
     */
    private auth;
    private solveReCapathca;
    /**
     * Открытие соединения
     * @returns
     */
    open(): Promise<NetworkConnection>;
    getCampaign(): Campaign;
    getAccount(): Account;
    /**
     * Поддержание соежинения в живых
     */
    keepAlive(): void;
}
