import { RESPONSE_CODES } from '../../consts';
import ExoclickConnection from './ExoclickConnection';
import { ErrorExoclick } from './api/Errors';
import FullDataCampaign, {
  IResultFullDataCampaignCountryItem,
  IResultFullDataCampaignVariation,
  IUpdateDataCampaignDayParting,
  IUpdateDataCampaignDayPartingItem
} from './api/FullDataCampaign';
import { Logger } from '@atsorganization/ats-lib-logger';

import {
  ScheduleCampaign,
  ResponceApiNetwork,
  IHttpResponse,
  IdCampaign,
  BrowserVersionCampaign,
  TargetUrlCampaign,
  StatusCampaign,
  PlacementCampaign,
  NameCampaign,
  ICampaign,
  CountryCampaign,
  Campaign,
  BidCampaign
} from '@atsorganization/ats-lib-ntwk-common';
import UpdateDataCampaign, { IUpdateDataCampaignZone } from './api/UpdateDataCampaign';
import UpdateUrlLlibrary from './api/UpdateUrlLlibrary';
import ResultUpdateUrlLlibrary from './api/ResultUpdateUrlLlibrary';
import UpdateVariationCampaign from './api/UpdateVariationCampaign';

export default class ExoclickCampaign extends Campaign {
  /**
   * Обвноление кампании
   * доступны следующие свойства
   * name
   * country
   * bid
   * target_гкд - меняет статус на модерацию !!!
   * schedule
   * placements_data
   * browser_version
   */
  async update(): Promise<ResponceApiNetwork<Campaign>> {
    this.handlerErrNotIdCampaign();
    throw Error('Method not implemented');
  }
  /**
   * Создание кампании
   * @param conn
   * @param data
   * @returns
   */
  async create(data: ICampaign): Promise<ResponceApiNetwork<Campaign>> {
    const { name, template_id, bid, country, placements_data, target_url, schedule } = data;

    const fullDataCampaign: FullDataCampaign | null = await this.getFullDataCampaign(new IdCampaign(template_id.value));
    if (!fullDataCampaign) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: 'Not get data from network'
      });
    }

    if (!target_url.value) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: 'Not get data from network'
      });
    }
    const newIdCampaign = await this.clone(new IdCampaign(template_id.value));
    if (!newIdCampaign) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: 'Error clone campaign in network'
      });
    }

    /**
     * СОздаем library URL
     */

    const newLIbraryURL = await this.createLIbraryURL(new UpdateUrlLlibrary({ url: target_url.value }));
    if (!newLIbraryURL?.[0]?.value?.id) {
      await this.removeUnit(newIdCampaign);
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(newLIbraryURL)
      });
    }

    /**
     * Создаем вариацию к кампании с library url
     */
    const reultUpdateVariationCampaign = await this.updateVariationCampaign(
      newIdCampaign.value,
      fullDataCampaign.value.variations[0].idvariation,
      new UpdateVariationCampaign({ id_library_url: newLIbraryURL?.[0]?.value?.id })
    );

    new Logger(reultUpdateVariationCampaign).setTag('updateVariationCampaign').log();

    /**
     * ОБновляем кампанию
     */
    const updateDataCampaign = new UpdateDataCampaign({
      id: Number(newIdCampaign.value),
      name: String(name.value),
      status: 1,
      countries: {
        type: 'targeted',
        elements: [
          { country: this.conn?.network?.collections?.countries?.find((f) => f.iso2 === String(country.value))?.iso3 }
        ]
      },
      pricing: { model: fullDataCampaign.value.campaign.pricing_model, price: Number(bid.value) * 100 }
    });

    // return fullDataCampaign.value;
    // new Logger({ fullDataCampaign, list: placements_data.value?.list?.length }).log();

    const responseCreateCampaign = await this.updateRaw(updateDataCampaign);

    if (responseCreateCampaign?.[0]?.includes('Campaign successfully updated')) {
      this.setId(newIdCampaign)
        .setName(name)
        .setTemplateId(template_id)
        .setBid(bid)
        .setCountry(country)
        .setPlacementsData(placements_data)
        .setTargetUrl(target_url)
        .setStatus(new StatusCampaign('moderation'));

      return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
    } else {
      // LogPrinter.error(
      //     new Logger(responseCreateCampaign)
      //         .setCampaignId(dataCampaignNetwork.templateId)
      //         .setBundleId(dataCampaignNetwork.bundleId)
      //         .setStage(dataCampaignNetwork.stage)
      // );
      await this.removeUnit(newIdCampaign);
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(responseCreateCampaign)
      });
    }
  }

  /**
   * Подгттовка корректного статуса для API
   * @param data
   * @returns
   */
  private prepareStatus(data: FullDataCampaign): StatusCampaign {
    const { campaign, variations } = data.value;
    const { calculated_status } = campaign;
    const { id, status: campaign_status } = calculated_status;
    // const { calculated_status: variation_status } = variations[0];
    return new StatusCampaign(
      campaign_status === 'Archived'
        ? 'archived'
        : ['Running'].includes(campaign_status)
        ? 'working'
        : campaign_status === 'Rejected'
        ? 'rejected'
        : campaign_status === 'Pending Approval'
        ? 'moderation'
        : 'stopped'
    );
  }

  /**
   * Устаноыка расписания кампании
   * по-умолчанию полное расписание
   * @param schedule
   */
  async updateSchedule(schedule: ScheduleCampaign = new ScheduleCampaign()): Promise<ResponceApiNetwork<Campaign>> {
    this.handlerErrNotIdCampaign();
    const dataUpdate = new UpdateDataCampaign({
      id: Number(this.id.value),
      status: 1,
      day_parting: this.reverseTransformSchedule(schedule)
    });

    const responseUpdateCampaign = await this.updateRaw(dataUpdate);

    if (responseUpdateCampaign?.[0]?.includes('Campaign successfully updated')) {
      this.setId(new IdCampaign(this.id.value)).setSchedule(schedule);

      return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
    } else {
      // LogPrinter.error(
      //     new Logger(responseCreateCampaign)
      //         .setCampaignId(dataCampaignNetwork.templateId)
      //         .setBundleId(dataCampaignNetwork.bundleId)
      //         .setStage(dataCampaignNetwork.stage)
      // );
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(responseUpdateCampaign)
      });
    }
  }

  /**
   * Транесформация расписания в нуждный формат
   * @param rawTimeData
   * @returns
   */
  private transformSchedule(rawTimeData: IUpdateDataCampaignDayPartingItem[]): ScheduleCampaign {
    const days = {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
      7: 'Sun'
    };

    return new ScheduleCampaign(
      rawTimeData.length
        ? rawTimeData.reduce(
            (ac: any, el: IUpdateDataCampaignDayPartingItem) =>
              ac.concat(el.hours.map((m: any) => days[el.day] + (m < 10 ? `0${m}` : m))),
            []
          )
        : undefined
    );
  }

  /**
   * ОБРАТНАЯ Транесформация расписания в нуждный формат
   * @param rawTimeData
   * @returns
   */
  private reverseTransformSchedule(rawTimeData: ScheduleCampaign): IUpdateDataCampaignDayParting {
    const days: { [key: string]: number } = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 7
    };

    return {
      timezone: 'Europe/Moscow',
      parting: rawTimeData.value.reduce((acc: any, item: any) => {
        const day = days[item.substring(0, 3)]; // Получаем первые 3 символа (Mon, Tue, и так далее)
        const hours = Number(item.substring(3)); // Получаем оставшиеся символы (часы) и преобразуем их в число

        // Проверяем, существует ли уже группа с таким днем
        const existingGroup = acc.find((group: any) => Number(group.day) === Number(day));

        if (existingGroup) {
          // Если группа уже существует, добавляем часы к ней
          existingGroup.hours.push(hours);
        } else {
          // Если группы еще нет, создаем новую группу
          acc.push({
            day,
            hours: [hours]
          });
        }

        return acc;
      }, [])
    };
  }

  /**
   * вытянуть все данные по кампании из сети
   */
  async fetch(): Promise<ResponceApiNetwork<Campaign>> {
    this.handlerErrNotIdCampaign();
    const fullDataResponse: FullDataCampaign | null = await this.getFullDataCampaign(this.id);
    if (!fullDataResponse) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: 'Not get data from network'
      });
    }

    const {
      zones,
      zone_targeting,
      day_parting,
      campaign: { name, id, price },
      countries: { targeted: CountryTargeted },
      variations
    } = fullDataResponse.value;
    const { url } = variations[0];
    let idCountry = -1;
    if (CountryTargeted?.[0]) {
      idCountry = CountryTargeted?.[0]?.id;
    }

    const actual_list = { list: zones.map((m) => m.idzone), type: zone_targeting.type };

    this.setId(new IdCampaign(id))
      .setName(new NameCampaign(name))
      .setTargetUrl(new TargetUrlCampaign(url))
      .setCountry(
        new CountryCampaign(
          this.conn.network?.collections?.countries?.find(
            (f: IResultFullDataCampaignCountryItem) => Number(f.id) === Number(idCountry)
          )?.iso2
        )
      )
      .setBid(new BidCampaign(price / 100))
      .setPlacementsData(
        new PlacementCampaign({
          list: actual_list?.list?.map((m: any) => m?.id) ?? [],
          type: actual_list?.type === 0 ?? false
        })
      )
      .setStatus(this.prepareStatus(fullDataResponse))
      .setSchedule(this.transformSchedule(day_parting));

    return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
  }

  /**
   * Создание library url
   * @param data
   * @returns
   */
  private async createLIbraryURL(data: UpdateUrlLlibrary): Promise<ResultUpdateUrlLlibrary[]> {
    const externalUrl = `library/url`;
    const createdLIbrry = await this.conn.api_conn
      ?.post(`${externalUrl}`, data.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((d: IHttpResponse) => d.data);

    return createdLIbrry.map((m: any) => new ResultUpdateUrlLlibrary(m));
  }

  /**
   * Обновление вариации кампании
   * @param data
   * @returns
   */
  private async updateVariationCampaign(
    campaignId: any,
    variationId: any,
    data: UpdateVariationCampaign
  ): Promise<ResultUpdateUrlLlibrary> {
    const externalUrl = 'campaigns/' + campaignId + '/variation/' + variationId;
    return await this.conn.api_conn
      ?.put(`${externalUrl}`, data.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((d: IHttpResponse) => d.data);
  }

  /**
   * обновлене кампании
   * @param data
   * @returns
   */
  protected async updateRaw(data: UpdateDataCampaign): Promise<any> {
    const externalUrl = `campaigns/${data.value.id}`;
    return await this.conn.api_conn
      ?.put(`${externalUrl}`, data.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((d: IHttpResponse) => d.data);
  }

  /**
   * Получение полной информации по кампании из сети
   * @param campaignId
   * @returns
   */
  private async getFullDataCampaign(campaignId: IdCampaign): Promise<FullDataCampaign | null> {
    const externalUrl = `campaigns/${campaignId.value}`;
    let data: FullDataCampaign | null = null;
    if (this.conn.api_conn) {
      data = await this.conn.api_conn.get(externalUrl).then((resp: IHttpResponse) => {
        // new Logger(resp.data).setTag('getFullDataCampaign').log();
        const r = resp.data.result;
        const campaign = r.campaign;
        const countries = r.countries;
        const variations = r.variations;
        const zones = r.zones;
        const zone_targeting = r.zone_targeting;
        const day_parting = r.day_parting;
        return new FullDataCampaign({
          campaign,
          variations,
          countries,
          zones,
          zone_targeting,
          day_parting
        });
      });
    }
    return data;
  }

  /**
   * Клонирвоание кампании
   * @param campaignId
   * @returns
   */
  private async clone(campaignId: IdCampaign): Promise<IdCampaign | false> {
    const externalUrlClone = `campaigns/${campaignId.value}/copy`;
    // Клонируем кампанию
    const cloneCampaignId = await this.conn.api_conn?.put(`${externalUrlClone}`, {}).then((d: IHttpResponse) => d.data);

    if (cloneCampaignId && cloneCampaignId.idcampaign) {
      // Дёргаем ID новосозанной кампании
      return new IdCampaign(cloneCampaignId.idcampaign);
    } else {
      return false;
    }
  }

  /**
   * Получение статуса кампани
   * @param id
   * @returns
   */
  async getStatus(): Promise<ResponceApiNetwork<StatusCampaign>> {
    this.handlerErrNotIdCampaign();
    const responseStatus = await this.getFullDataCampaign(this.id);

    if (responseStatus && responseStatus?.value?.campaign?.id) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.SUCCESS,
        message: 'OK',
        data: this.prepareStatus(responseStatus)
      });
    } else {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(responseStatus)
      });
    }
  }

  /**
   * Обновление площадок в кампании
   * @param data
   * @returns
   */
  async updatePlacements(data: PlacementCampaign): Promise<ResponceApiNetwork<Campaign>> {
    this.handlerErrNotIdCampaign();
    const _val = data.value;
    const list = [...new Set(_val?.list ?? [])];
    const type = _val?.type;
    const typeList = !type ? 1 : 0;
    const status = 0;
    const updateData = new UpdateDataCampaign({
      id: Number(this.id.value),
      status,
      zones: list.map((m: IUpdateDataCampaignZone) => {
        return {
          idzone: Number(m),
          price: 0
        };
      }),
      zone_targeting: {
        type: typeList,
        network_selection: 0,
        partner_networks: 0
      }
    });
    const responseSetPlacement = await this.updateRaw(updateData);
    // const dataCamp = responseSetPlacement?.data;
    // const status = responseSetPlacement?.status;

    if (responseSetPlacement?.[0]?.includes('Campaign successfully updated')) {
      this.setPlacementsData(
        new PlacementCampaign({
          list: list ?? [],
          type: type ?? false
        })
      )
        /**
         * TODO: сделать запрос на получение актуального статуса
         */
        .setStatus(new StatusCampaign('working'));

      return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
    } else {
      return new ResponceApiNetwork({
        code: Number(status),
        message: JSON.stringify(responseSetPlacement)
      });
    }
  }

  /**
   * Удаление кампании
   */
  async remove(): Promise<ResponceApiNetwork> {
    this.handlerErrNotIdCampaign();
    return await this.removeUnit(this.id);
  }

  /**
   * Точеченое удаление кампании
   * @param id
   * @returns
   */
  private async removeUnit(id: IdCampaign): Promise<ResponceApiNetwork> {
    const dataDeleteCampaign = {
      campaign_ids: [id.value]
    };
    const externalUrl = 'campaigns/delete';
    const headers = {
      'Content-Type': 'application/json'
    };
    const responseRemove = await this.conn.api_conn
      ?.put(externalUrl, dataDeleteCampaign, {
        headers
      })
      .then((resp: IHttpResponse) => resp.data);
    const success = responseRemove && responseRemove.message && responseRemove.message.includes('Campaigns deleted');
    return new ResponceApiNetwork({
      code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: success ? 'OK' : JSON.stringify(responseRemove)
    });
  }

  /**
   * Запуск кампании
   */
  async start(): Promise<ResponceApiNetwork> {
    this.handlerErrNotIdCampaign();
    const updateData = new UpdateDataCampaign({
      id: Number(this.id.value),
      status: 1
    });
    const getUpdateCampaign = await this.updateRaw(updateData);

    const success = getUpdateCampaign?.[0].includes('Campaign successfully updated');

    return new ResponceApiNetwork({
      code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: success ? 'OK' : JSON.stringify(getUpdateCampaign)
    });
  }

  /**
   * Остановка кампании
   */
  async stop(): Promise<ResponceApiNetwork> {
    this.handlerErrNotIdCampaign();
    const updateData = new UpdateDataCampaign({
      id: Number(this.id.value),
      status: 0
    });
    const getUpdateCampaign = await this.updateRaw(updateData);

    const success = getUpdateCampaign?.[0].includes('Campaign successfully updated');

    return new ResponceApiNetwork({
      code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: success ? 'OK' : JSON.stringify(getUpdateCampaign)
    });
  }

  /**
   * Отмена модерации
   * @param campaignId
   * @returns
   */
  /*
  private async cancelModeration(): Promise<boolean> {
    const externalUrl = 'api/v1.0/client/campaigns/cancel/';
    const listCampaignsFromCancelModeration = { campaignIds: [this.id?.value] };

    const headers = {
      'Content-Type': 'application/json'
    };
    const responseCancelModeration = await this.conn.admin_conn
      ?.put(externalUrl, listCampaignsFromCancelModeration, {
        headers: headers
      })
      .then((resp: IHttpResponse) => resp.data);

    // new Logger({
    //     responseCancelModeration,
    //     url,
    //     data: listCampaignsFromCancelModeration,
    //     headers,
    // })
    //     .setTag('cancelModeration')
    //     .setNetwork(this.constructor.name.toLowerCase())
    //     .setCampaignId(campaignId)
    //     .log();
    return responseCancelModeration && responseCancelModeration.result && responseCancelModeration.result === 'success';
  }*/
}
