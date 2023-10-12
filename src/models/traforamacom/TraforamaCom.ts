import { Account, Campaign, Network, NetworkConnection } from "@atsorganization/ats-lib-ntwk-common";
import RedisCache from "@atsorganization/ats-lib-redis";
import TraforamaComConnection from "./TraforamaComConnection";

export default class TraforamaCom extends Network{
    constructor(login: string, password: string, api_key: string, redisCache: RedisCache = new RedisCache()) {
        super(login, password, api_key, redisCache);
        this.base_url_api = 'https://api.adspyglass.com/api/';
        this.base_url_admin = "https://app.traforama.com/"
            
    }
    createConnection(): Promise<NetworkConnection> {
        return (new TraforamaComConnection(this))
            .open()
    }


}
