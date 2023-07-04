import Campaign from './Campaign';
import Network from './Network';
import HttpInstance from '../http/HttpInstance';
export default abstract class NetworkConnection {
    api_conn: HttpInstance | null;
    admin_conn: HttpInstance | null;
    protected network: Network;
    constructor(network: Network);
    /**
     * Открытие соединения
     */
    abstract open(): Promise<NetworkConnection>;
    /**
     * Закрытие соединения
     */
    close(): void;
    abstract getCampaign(): Campaign;
    /**
     * Поддержание соежинения в живых
     */
    abstract keepAlive(): void;
}
