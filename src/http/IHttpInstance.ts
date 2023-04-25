import IHttpHeaders from "./IHttpHeaders";
import IHttpResponse from "./IHttpResponse";

export default interface IHttpInstance {
    instance: any,
    get(url: string, headers: IHttpHeaders): Promise<IHttpResponse>
    put(url: string, body: any, headers: IHttpHeaders): Promise<IHttpResponse>;
    post(url: string, body: any, headers: IHttpHeaders): Promise<IHttpResponse>;
    delete(url: string, headers: IHttpHeaders): Promise<IHttpResponse>;
    keepAlive(callback: Function): void;
}