export default class BidCampaign {
    constructor(readonly _value: number | null = null) { }

    get value(): number | null {
        return this._value;
    }
}