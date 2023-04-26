export type status = 'moderation' | 'draft' | 'rejected' | 'stopped' | 'working' | 'archived';
export default class StatusCampaign {
    constructor(readonly _value: status | null = null) { }

    get value(): status | null {
        return this._value;
    }
}