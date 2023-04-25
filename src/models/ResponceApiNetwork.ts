import Campaign from "./Campaign";

export default class ResponceApiNetwork {
    constructor(readonly _value: { code: number, message: string, campaign?: Campaign, } | null = null) { }

    get value(): { code: number, message: string, campaign?: Campaign, } | null {
        return this._value;
    }
}