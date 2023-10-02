interface IAddCreative {
  campaignId: string;
  creative: {
    clickUrl: string;
    html?: string;
    name: string;
  };
}

export default class AddCreative {
  constructor(readonly _value: IAddCreative) {}

  get value(): IAddCreative {
    return this._value;
  }
}
