import IHttpConfig from "./IHttpConfig";
import IHttpHeaders from "./IHttpHeaders";
import IHttpInstance, { validateStatus } from "./IHttpInstance";
import IHttpResponse from "./IHttpResponse";
type KeepAliveCallbackErr = (responseErr: {
    config: IHttpConfig;
    status?: number;
}) => Promise<any>;
export default class HttpInstance implements IHttpInstance {
    instance: any;
    constructor(config: IHttpConfig);
    static request(config: IHttpConfig): Promise<IHttpResponse>;
    get(url: string, headers?: IHttpHeaders, validateStatus?: validateStatus): Promise<IHttpResponse>;
    put(url: string, data?: any, headers?: IHttpHeaders, validateStatus?: validateStatus): Promise<IHttpResponse>;
    post(url: string, data?: any, headers?: IHttpHeaders, validateStatus?: validateStatus): Promise<IHttpResponse>;
    delete(url: string, headers?: IHttpHeaders, validateStatus?: validateStatus): Promise<IHttpResponse>;
    keepAlive(callbackErr: KeepAliveCallbackErr): void;
}
export {};
