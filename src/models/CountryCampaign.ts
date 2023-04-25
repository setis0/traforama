export default class CountryCampaign {
    constructor(readonly _value: string | null = null) { }

    get value(): string | null {
        return this._value;
    }
}