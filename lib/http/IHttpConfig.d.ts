import IHttpHeaders from "./IHttpHeaders";
type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'post' | 'POST' | 'put' | 'PUT';
export default interface IHttpConfig {
    url?: string;
    method?: Method;
    baseUrl?: string;
    headers?: IHttpHeaders;
    data?: any;
    __isRetryRequest?: any;
}
export {};
