import { Account, ResponceApiNetwork } from 'ats-lib-ntwk-common';
export default class ClickaduAccount extends Account {
    /**
     * Получение баласна
     */
    getBalance(): Promise<ResponceApiNetwork>;
    /**
     * Получить данные аккаунта из сети
     */
    fetch(): Promise<ResponceApiNetwork>;
}