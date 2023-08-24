interface IUpdateUrlLlibrary {
  url: string;
}

export default class UpdateUrlLlibrary {
  constructor(readonly _value: IUpdateUrlLlibrary) {}

  get value(): IUpdateUrlLlibrary {
    return this._value;
  }
}
