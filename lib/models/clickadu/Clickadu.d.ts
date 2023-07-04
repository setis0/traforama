import { Network, NetworkConnection } from 'ats-lib-ntwk-common';
export default class Clickadu extends Network {
    constructor(login: string, password: string, api_key: string);
    createConnection(): Promise<NetworkConnection>;
}
