export default class StageCampaign {
    constructor(readonly _value: number) { }

    get value(): number {
        return this._value;
    }
}