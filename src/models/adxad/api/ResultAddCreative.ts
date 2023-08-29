interface IResultAddCreative {
  status: string;
  id: string;
}

export default class ResultAddCreative {
  constructor(readonly _value: IResultAddCreative) {}

  get value(): IResultAddCreative {
    return this._value;
  }
}
