interface IErrorAdxAd {
  error: {
    code: number;
    message: string;
  };
}

export class ErrorAdxAd {
  constructor(readonly _value: IErrorAdxAd) {}

  get value(): IErrorAdxAd {
    return this._value;
  }
}
