export default class TemplateIdCampaign {
    constructor(readonly _value: string | null = null) { }

    get value(): string | null {
        return this._value;
    }
}