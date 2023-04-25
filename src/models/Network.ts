import NetworkConnection from "./NetworkConnection";
import AdNetworkConnection from "./NetworkConnection";

export default abstract class Network {
  public api_key: string;
  public login: string;
  public password: string;
  public base_url_api: string = '';
  public base_url_admin: string = '';

  constructor(login: string, password: string, api_key: string) {
    this.login = login;
    this.password = password;
    this.api_key = api_key;
  }

  abstract createConnection(): Promise<NetworkConnection>;
}
