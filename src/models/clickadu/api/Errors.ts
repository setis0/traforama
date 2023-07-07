interface IErrorClickadu {
  error: {
    code: number;
    message: string;
  };
}

export class ErrorClickadu {
  constructor(readonly _value: IErrorClickadu) {}

  get value(): IErrorClickadu {
    return this._value;
  }
}
