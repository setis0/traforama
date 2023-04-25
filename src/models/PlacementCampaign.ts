export default class PlacementCampaign {
    constructor(readonly _value: { list: any[], type: boolean } | null = null) { }

    get value(): { list: any[], type: boolean } | null {
        return this._value;
    }
}