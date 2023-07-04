import BalanceAccount from "./BalanceAccount";
import IAccount from "./IAccount";
import NetworkConnection from "./NetworkConnection";
import ResponceApiNetwork from "./ResponceApiNetwork";
export default abstract class Account implements IAccount {
    balance: BalanceAccount;
    protected conn: NetworkConnection;
    constructor(conn: NetworkConnection);
    /**
     * Установка баласна
     */
    setBalance(newBalance: BalanceAccount): Account;
    /**
     * ПОлучение баласна
     */
    abstract getBalance(): Promise<ResponceApiNetwork>;
    /**
    * Получить данные аккаунта из сети
     */
    abstract fetch(): Promise<ResponceApiNetwork>;
}
