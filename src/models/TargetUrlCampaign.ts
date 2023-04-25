export default class TargetUrlCampaign {
    constructor(readonly _value: string | null = null) { }

    get value(): string | null {
        return this._value;
    }
}