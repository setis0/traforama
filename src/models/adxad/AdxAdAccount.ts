import { RESPONSE_CODES } from '../../consts';
import { IHttpResponse, Account, BalanceAccount, ResponceApiNetwork } from '@atsorganization/ats-lib-ntwk-common';

export default class AdxAdAccount extends Account {
  /**
   * Получение баласна
   */
  async getBalance(): Promise<ResponceApiNetwork<BalanceAccount>> {
    const externalUrl = 'user/balance/list?page=1&limit=20';
    const responseBalance = await this.conn.api_conn?.get(externalUrl).then((resp: IHttpResponse) => resp.data);

    const account = responseBalance?.data?.find(
      (f: any) => f.email?.toLowerCase() === this.conn.network?.login?.toLowerCase()
    );
    const balance = account?.balance;
    if (balance) {
      this.setBalance(new BalanceAccount(Number(balance) / 100));
    }
    return new ResponceApiNetwork({
      code: balance ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: balance ? 'OK' : JSON.stringify(responseBalance),
      data: balance ? new BalanceAccount(Number(balance) / 100) : undefined
    });
  }

  /**
   * Получить данные аккаунта из сети
   */
  fetch(): Promise<ResponceApiNetwork<Account>> {
    throw new Error('Method not implemented.');
  }
}
