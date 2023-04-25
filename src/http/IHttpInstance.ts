import IHttpHeaders from "./IHttpHeaders";
import IHttpResponse from "./IHttpResponse";

export type validateStatus = (status: number) => void
export default interface IHttpInstance {
    instance: any,
    get(url: string, headers: IHttpHeaders, validateStatus?: validateStatus): Promise<IHttpResponse>
    put(url: string, body: any, headers: IHttpHeaders, validateStatus?: validateStatus): Promise<IHttpResponse>;
    post(url: string, body: any, headers: IHttpHeaders, validateStatus?: validateStatus): Promise<IHttpResponse>;
    delete(url: string, headers: IHttpHeaders, validateStatus?: validateStatus): Promise<IHttpResponse>;
    keepAlive(callback: Function): void;
}