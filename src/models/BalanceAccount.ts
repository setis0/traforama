export default class BalanceAccount {
    constructor(readonly _value: number | null = null) { }

    get balance(): number | null {
        return this._value;
    }
}