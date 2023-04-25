export default class IdCampaign {
    constructor(readonly _value: string | null = null) { }

    get value(): string | null {
        return this._value;
    }
}