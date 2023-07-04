export default class BalanceAccount {
    readonly _value: number | null;
    constructor(_value?: number | null);
    get balance(): number | null;
}
