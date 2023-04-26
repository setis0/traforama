import Account from "./Account";
import Campaign from "./Campaign";

export default class ResponceApiNetwork {
    constructor(readonly _value: { code: number, message: string, data?: Campaign | Account, } | null = null) { }

    get value(): { code: number, message: string, data?: Campaign | Account, } | null {
        return this._value;
    }
}