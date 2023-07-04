import NetworkConnection from './NetworkConnection';
export default abstract class Network {
    api_key: string;
    login: string;
    password: string;
    base_url_api: string;
    base_url_admin: string;
    constructor(login: string, password: string, api_key: string);
    abstract createConnection(): Promise<NetworkConnection>;
}
