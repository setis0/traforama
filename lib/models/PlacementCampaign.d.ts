export default class PlacementCampaign {
    readonly _value: {
        list: any[];
        type: boolean;
    } | null;
    constructor(_value?: {
        list: any[];
        type: boolean;
    } | null);
    get value(): {
        list: any[];
        type: boolean;
    } | null;
}
