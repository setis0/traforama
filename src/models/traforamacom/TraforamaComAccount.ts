import { Account, BalanceAccount, ResponceApiNetwork, StatsAccount } from "@atsorganization/ats-lib-ntwk-common";
import {RESPONSE_CODES} from "../../consts";
import {ApiBalance} from "./api";

export default class TraforamaComAccount extends Account{
    async getBalance(): Promise<ResponceApiNetwork<BalanceAccount>> {
        const response = await this.conn.api_conn?.get('/balance')
        const balance = (response?.data as ApiBalance).balance
        if (balance) {
            this.setBalance(new BalanceAccount(Number(balance)));
        }
        return new ResponceApiNetwork({
                                          code: balance ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                                          message: balance ? 'OK' : JSON.stringify(response),
                                          data: balance ? new BalanceAccount(Number(balance)) : undefined
                                      });
    }
    fetch(): Promise<ResponceApiNetwork<Account>> {
        throw new Error("Method not implemented.");
    }
    stats(dateFrom: string, dateTo: string): Promise<ResponceApiNetwork<StatsAccount>> {
        throw new Error("Method not implemented.");
    }

}
