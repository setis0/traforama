import axios, { AxiosError, AxiosResponse } from "axios";
import IHttpConfig from "./IHttpConfig";
import IHttpHeaders from "./IHttpHeaders";
import IHttpInstance from "./IHttpInstance";
import IHttpResponse from "./IHttpResponse";



type KeepAliveCallbackErr = (responseErr: { config: IHttpConfig, status?: number, }) => Promise<any>

export default class HttpInstance implements IHttpInstance {
    instance: any

    constructor(config: IHttpConfig) {
        const { baseUrl, headers, url, method, data } = config;
        this.instance = axios.create({
            url,
            method,
            baseURL: baseUrl,
            headers: headers,
            data,
        });
    }

    static request(config: IHttpConfig): Promise<IHttpResponse> {
        return axios(config);
    }

    get(url: string, headers?: IHttpHeaders): Promise<IHttpResponse> {
        return this.instance.get(url, { headers });
    }

    put(url: string, data?: any, headers?: IHttpHeaders): Promise<IHttpResponse> {
        return this.instance.put(url, data, { headers });
    }
    post(url: string, data?: any, headers?: IHttpHeaders): Promise<IHttpResponse> {
        return this.instance.post(url, data, { headers });
    }
    delete(url: string, headers?: IHttpHeaders): Promise<IHttpResponse> {
        return this.instance.delete(url, { headers });
    }

    keepAlive(callbackErr: KeepAliveCallbackErr): void {
        this.instance.interceptors.response.use(undefined, async (err: AxiosError) => {
            const error = err.response;

            return callbackErr({ status: error?.status, config: { url: error?.config.url, baseUrl: error?.config.baseURL } });


            // return error;
        });
    }
}