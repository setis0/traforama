import { RESPONSE_CODES } from '../../consts';
import { IHttpResponse, Account, BalanceAccount, ResponceApiNetwork } from '@atsorganization/ats-lib-ntwk-common';

export default class TrendingBidAccount extends Account {
  /**
   * Получение баласна
   */
  async getBalance(): Promise<ResponceApiNetwork<BalanceAccount>> {
    const externalUrl = 'api/user/getprofile';
    const responseBalance = await this.conn.admin_conn?.get(externalUrl).then((resp: IHttpResponse) => resp.data);

    const account = responseBalance?.data;
    const balance = account?.balance;
    if (balance) {
      this.setBalance(new BalanceAccount(Number(balance)));
    }
    return new ResponceApiNetwork({
      code: balance ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: balance ? 'OK' : JSON.stringify(responseBalance),
      data: balance ? new BalanceAccount(Number(balance)) : undefined
    });
  }

  /**
   * Получить данные аккаунта из сети
   */
  fetch(): Promise<ResponceApiNetwork<Account>> {
    throw new Error('Method not implemented.');
  }
}
