import IHttpHeaders from "./IHttpHeaders";

type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    // | 'head' | 'HEAD'
    // | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT';
// | 'patch' | 'PATCH'
// | 'purge' | 'PURGE'
// | 'link' | 'LINK'
// | 'unlink' | 'UNLINK';
export default interface IHttpConfig {
    url?: string;
    method?: Method;
    baseUrl?: string;
    headers?: IHttpHeaders;
    data?: any;
    __isRetryRequest?: any;
}