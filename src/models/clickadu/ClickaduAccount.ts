import { RESPONSE_CODES } from "../../consts";
import IHttpResponse from "../../http/IHttpResponse";
import Account from "../Account";
import BalanceAccount from "../BalanceAccount";
import ResponceApiNetwork from "../ResponceApiNetwork";

export default class ClickaduAccount extends Account {

    /**
     * Получение баласна
     */
    async getBalance(): Promise<ResponceApiNetwork> {
        const externalUrl = 'api/v2/client/balance/';
        const responseBalance = await this.conn.api_conn?.get(externalUrl).then((resp: IHttpResponse) => resp.data);
        // new Logger({
        //     resp: responseBalance,
        //     url,
        //     headers
        // })
        //     .setTag('getBalance')
        //     .setNetwork(this.constructor.name.toLowerCase())
        //     .log();

        const balance = responseBalance &&
            responseBalance.result &&
            responseBalance.result.advertiser &&
            responseBalance.result.advertiser.balance ? responseBalance.result.advertiser.balance : undefined;
        if (this.balance) {
            this.setBalance(new BalanceAccount(balance))
        }
        return new ResponceApiNetwork({ code: balance ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR, message: balance ? 'OK' : JSON.stringify(responseBalance), data: balance })
    }

    /**
    * Получить данные аккаунта из сети
     */
    fetch(): Promise<ResponceApiNetwork> {
        throw new Error("Method not implemented.");
    }

}