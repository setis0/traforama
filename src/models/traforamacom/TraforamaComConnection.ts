import {Account, Campaign, HttpInstance, IHttpConfig, NetworkConnection} from "@atsorganization/ats-lib-ntwk-common";
import TraforamaComCampaign from "./TraforamaComCampaign";
import TraforamaComAccount from "./TraforamaComAccount";

export default class TraforamaComConnection extends NetworkConnection {
    async open(): Promise<NetworkConnection> {
        this.api_conn = new HttpInstance({
                                             baseUrl: this.network?.base_url_api,
                                             headers: {
                                                 "X-ASG-AUTH-EMAIL": this.network.login,
                                                 "X-ASG-AUTH-TOKEN": this.network.api_key,
                                                 "Accept": "application/json"
                                             }
                                         });
        console.log({
                        baseUrl: this.network?.base_url_api,
                        headers: {
                            "X-ASG-AUTH-EMAIL": this.network.login,
                            "X-ASG-AUTH-TOKEN": this.network.api_key,
                            "Accept": "application/json"
                        }
                    });
        return this;
    }

    getAccount(): Account {
        return new TraforamaComAccount(this)
    }

    getCampaign(): Campaign {
        return new TraforamaComCampaign(this)
    }

    keepAlive(): void {
        this.api_conn?.keepAlive(async () => {
        }, async response => {
            return response;
        });
    }

}
