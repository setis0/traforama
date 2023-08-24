interface IUpdateVariationCampaign {
  id_library_url: number;
}

export default class UpdateVariationCampaign {
  constructor(readonly _value: IUpdateVariationCampaign) {}

  get value(): IUpdateVariationCampaign {
    return this._value;
  }
}
