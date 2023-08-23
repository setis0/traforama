interface IErrorExoclick {
  error: {
    code: number;
    message: string;
  };
}

export class ErrorExoclick {
  constructor(readonly _value: IErrorExoclick) {}

  get value(): IErrorExoclick {
    return this._value;
  }
}
