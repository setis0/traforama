import IHttpHeaders from "./IHttpHeaders";

export default interface IHttpResponse {
    data: any;
    status: number;
    headers: IHttpHeaders
}