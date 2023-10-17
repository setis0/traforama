import {Account, Campaign, HttpInstance, IHttpConfig, NetworkConnection} from "@atsorganization/ats-lib-ntwk-common";
import {CountryRoot, FilterStatus, ResponseCountry} from "./api";
import TraforamaComCampaign from "./TraforamaComCampaign";
import TraforamaComAccount from "./TraforamaComAccount";

export default class TraforamaComConnection extends NetworkConnection {
    collections: {
        country: Map<string, string>,
        status: {[status:string]:string}
    } = {
        country: new Map<string, string>(),
        status: {
            review:"moderation",
            new:"draft",
            paused:"stopped",
            rejected:"rejected",
            approved:"working",
            completed:"archived"

        }
    }

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

    async initCollections() {
        const responseCountries = await this.getCountries()
        responseCountries.forEach(value => {
            this.collections.country.set(value.attributes.iso, value.id)
        })

    }

    protected async _getCountries(offset: number = 0, limit: number = 1000) {
        const response = await this
            .api_conn
            ?.get(`/v1/countries?start=${offset}&limit=${limit}`) as ResponseCountry
        if (response.data.error) {
            throw  new Error(response.data.message)
        }
        return response.data as CountryRoot
    }

    protected async getCountries(limit: number = 1e3) {
        const response = await this._getCountries(0, limit)
        const total = response.meta.total
        if (limit >= total) {
            const count = Math.ceil(total / limit)
            const result = [...response.data]
            for (let i = 1; count >= i; i++) {
                const data = await this._getCountries(i * limit, limit)
                result.push(...data.data)
            }
            return result
        }
        return response.data
    }
    public getCountryByCode(code:string){
        if(!this.collections.country.has(code)){
            return null
        }
        return this.collections.country.get(code) as string
    }

}
