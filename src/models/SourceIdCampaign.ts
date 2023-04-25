export default class SourceIdCampaign {
    constructor(readonly _value: number) { }

    get value(): number {
        return this._value;
    }
}