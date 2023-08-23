import { RESPONSE_CODES } from '../../consts';
import { IHttpResponse, Account, BalanceAccount, ResponceApiNetwork } from '@atsorganization/ats-lib-ntwk-common';

export default class ExcoclickAccount extends Account {
  /**
   * Получение баласна
   */
  async getBalance(): Promise<ResponceApiNetwork<BalanceAccount>> {
    const externalUrl = 'user';
    const responseBalance = await this.conn.api_conn?.get(externalUrl).then((resp: IHttpResponse) => resp.data);
    // new Logger({
    //     resp: responseBalance,
    //     url,
    //     headers
    // })
    //     .setTag('getBalance')
    //     .setNetwork(this.constructor.name.toLowerCase())
    //     .log();

    const balance =
      responseBalance && responseBalance.result && responseBalance.result.balance
        ? responseBalance.result.balance
        : undefined;
    if (this.balance) {
      this.setBalance(new BalanceAccount(balance));
    }
    return new ResponceApiNetwork({
      code: balance ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: balance ? 'OK' : JSON.stringify(responseBalance),
      data: new BalanceAccount(balance)
    });
  }

  /**
   * Получить данные аккаунта из сети
   */
  fetch(): Promise<ResponceApiNetwork<Account>> {
    throw new Error('Method not implemented.');
  }
}
