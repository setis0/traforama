import Campaign from "./Campaign";
import Network from "./Network";
import ICampaign from "./ICampaign";
import HttpInstance from "../http/HttpInstance";
import ResponceApiNetwork from "./ResponceApiNetwork";

export default abstract class NetworkConnection {
    public api_conn: HttpInstance | null;
    public admin_conn: HttpInstance | null;
    protected network: Network;

    constructor(network: Network) {
        this.network = network;
        this.api_conn = this.admin_conn = new HttpInstance({});
    }

    /**
     * Открытие соединения
     */
    abstract open(): Promise<NetworkConnection>;

    /**
     * Создание кампании
     * @param campaign_data 
     */
    abstract createCampaign(campaign_data: ICampaign): Promise<ResponceApiNetwork>;

    /**
     * Списко кампаний
     */
    abstract listCampaigns(): Promise<Campaign>;

    /**
     * ПОлучение капании по id
     * @param id 
     */
    abstract getCampaign(id: string): Promise<Campaign>

    /**
     * Закрытие соединения
     */
    close() {
        this.api_conn = null;
        this.admin_conn = null;
    }

    /**
     * Поддержание соежинения в живых
     */
    abstract keepAlive(): void;
}
