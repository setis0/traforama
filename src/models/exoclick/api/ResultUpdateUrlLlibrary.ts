interface IResultUpdateUrlLlibrary {
  id: number;
  created_at: string;
  updated_at: string;
  is_adult: number;
  url: string;
  status: number;
}

export default class ResultUpdateUrlLlibrary {
  constructor(readonly _value: IResultUpdateUrlLlibrary) {}

  get value(): IResultUpdateUrlLlibrary {
    return this._value;
  }
}
