export type status = 'moderation' | 'draft' | 'rejected' | 'stopped' | 'working' | 'archived';
export default class StatusCampaign {
    readonly _value: status | null;
    constructor(_value?: status | null);
    get value(): status | null;
}
