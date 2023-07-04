import Account from "./Account";
import Campaign from "./Campaign";
export default class ResponceApiNetwork {
    readonly _value: {
        code: number;
        message: string;
        data?: Campaign | Account;
    } | null;
    constructor(_value?: {
        code: number;
        message: string;
        data?: Campaign | Account;
    } | null);
    get value(): {
        code: number;
        message: string;
        data?: Campaign | Account;
    } | null;
}
