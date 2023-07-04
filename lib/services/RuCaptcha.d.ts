export default class RuCaptcha {
    private api_key;
    private min_await_sec;
    private base_url;
    constructor(api_key: any);
    sendReCaptcha(site_key: any, site_url: any): Promise<any>;
    result(id: any): Promise<any>;
}
