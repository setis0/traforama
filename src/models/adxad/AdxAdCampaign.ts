import { RESPONSE_CODES } from '../../consts';
import FullDataCampaign, { IResultFullDataCampaign, IUpdateDataCampaignSchedule } from './api/FullDataCampaign';
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
  BidCampaign,
  StatsRaw
} from '@atsorganization/ats-lib-ntwk-common';
import { IAddDataCampaign, IUpdateDataCampaignZone } from './api/AddDataCampaign';

import ResultUpdateUrlLlibrary from './api/ResultAddCreative';
import UpdateVariationCampaign from './api/UpdateVariationCampaign';
import AddCreative from './api/AddCreative';
import ResultAddCreative from './api/ResultAddCreative';
import AddDataCampaign from './api/AddDataCampaign';
import UpdateDataCampaign from './api/UpdateDataCampaign';
import FullDataCampaignStats, { IResultFullDataCampaignStatsDataItem } from './api/FullDataCampaignStats';

export default class AdxAdCampaign extends Campaign {
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

    /**
     * Создание кампании
     */
    const { project, mediaType, segments } = fullDataCampaign.value;

    const addDataCampaign = new AddDataCampaign({
      ...fullDataCampaign.value,
      format: '',
      segments: segments ?? [],
      project: project.id,
      mediaType: mediaType.id
    })
      .setCountry(String(country.value))
      .setBid(Number(bid.value))
      .setName(String(name.value))
      .prepare();

    const responseCreateCampaign = await this.addRaw(addDataCampaign);

    if (!responseCreateCampaign?.id) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(responseCreateCampaign) + ' add campaigns'
      });
    }

    const newCreative = await this.createCreative(
      new AddCreative({
        campaignId: responseCreateCampaign?.id,
        creative: { clickUrl: target_url.value, name: String(name.value) }
      })
    );

    if (newCreative?.value?.id) {
      this.setId(responseCreateCampaign?.id)
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
      await this.removeUnit(new IdCampaign(responseCreateCampaign.id));
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(newCreative) + ' add creative'
      });
    }
  }

  /**
   * Подгттовка корректного статуса для API
   * @param data
   * @returns
   */
  private prepareStatus(data: FullDataCampaign): StatusCampaign {
    const { status: statusCampaign, creatives } = data.value;
    const { status: statusCreative } = creatives[0];
    // Если у креатива статус можерация то используем егго статус для определения статуса каспании
    const status = statusCreative === 2 ? statusCreative : statusCampaign;
    return new StatusCampaign(
      status === 1 ? 'working' : status === 0 ? 'stopped' : status === 2 ? 'moderation' : 'rejected'
    );
  }

  /**
   * Устаноыка расписания кампании
   * по-умолчанию полное расписание
   * @param schedule
   */
  async updateSchedule(schedule: ScheduleCampaign = new ScheduleCampaign()): Promise<ResponceApiNetwork<Campaign>> {
    this.handlerErrNotIdCampaign();
    throw Error('Method not implemented');
    // const dataUpdate = new UpdateDataCampaign({
    //   id: Number(this.id.value),
    //   status: 1,
    //   day_parting: this.reverseTransformSchedule(schedule)
    // });

    // const responseUpdateCampaign = await this.updateRaw(dataUpdate);

    // if (responseUpdateCampaign?.[0]?.includes('Campaign successfully updated')) {
    //   this.setId(new IdCampaign(this.id.value)).setSchedule(schedule);

    //   return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
    // } else {
    //   return new ResponceApiNetwork({
    //     code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
    //     message: JSON.stringify(responseUpdateCampaign)
    //   });
    // }
  }

  /**
   * Транесформация расписания в нуждный формат
   * @param rawTimeData
   * @returns
   */
  private transformSchedule(rawSchedule: IUpdateDataCampaignSchedule): ScheduleCampaign {
    const schedule = rawSchedule;

    return new ScheduleCampaign(
      Object.keys(schedule).reduce(
        (cur: any, el: any) =>
          cur.concat(
            schedule[el].map(
              (hour: number) => `${el.charAt(0).toUpperCase() + el.slice(1)}${hour.toString().padStart(2, '0')}`
            )
          ),
        []
      )
    );
  }

  /**
   * ОБратнаяи Транесформация расписания в нуждный формат
   * @param rawTimeData
   * @returns
   */
  private reverseTransformSchedule(rawSchedule: ScheduleCampaign): IUpdateDataCampaignSchedule {
    const reversedSchedule: any = {};

    for (const str of rawSchedule.value) {
      const day = str.substring(0, 3).toLowerCase(); // Извлекаем день недели из строки
      const hour = parseInt(str.substring(3), 10); // Извлекаем час из строки и преобразуем в число

      if (!reversedSchedule[day]) {
        reversedSchedule[day] = [];
      }

      reversedSchedule[day].push(hour);
    }

    return reversedSchedule;
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

    const { id, creatives, targetings, name, bid, placements, schedule } = fullDataResponse.value;
    const { clickUrl: url } = creatives[0];
    const { countries, spots } = targetings;

    const actualList = { list: spots?.value, type: !spots?.mode };

    this.setId(new IdCampaign(id))
      .setName(new NameCampaign(name))
      .setTargetUrl(new TargetUrlCampaign(url))
      .setCountry(new CountryCampaign(countries.value[0]))
      .setBid(new BidCampaign(bid))
      .setPlacementsData(
        new PlacementCampaign({
          list: actualList?.list ?? [],
          type: actualList?.type ?? false
        })
      )
      .setStatus(this.prepareStatus(fullDataResponse))
      .setSchedule(this.transformSchedule(schedule));

    return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
  }

  /**
   * Создание креатива
   * @param data
   * @returns
   */
  private async createCreative(data: AddCreative): Promise<ResultAddCreative | null> {
    const externalUrl = `creative`;
    let createdCreative = null;
    if (this.conn.api_conn) {
      createdCreative = await this.conn.api_conn
        ?.post(`${externalUrl}`, data.value, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((d: IHttpResponse) => new ResultAddCreative(d.data));
    }
    return createdCreative;
  }

  /**
   * обновлене кампании
   * @param data
   * @returns
   */
  protected async updateRaw(data: UpdateDataCampaign): Promise<any> {
    const externalUrl = `campaign`;
    return await this.conn.api_conn
      ?.put(`${externalUrl}`, data.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((d: IHttpResponse) => d.data);
  }

  /**
   * создание кампании
   * @param data
   * @returns
   */
  protected async addRaw(data: AddDataCampaign): Promise<any> {
    const externalUrl = `campaign`;
    return await this.conn.api_conn
      ?.post(`${externalUrl}`, data.value, {
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
    const externalUrl = `campaign/get?id=${campaignId.value}`;
    const externalUrlCreative = `creative/list?page=1&limit=3000&filter[campaign][]=${campaignId.value}`;
    let data: FullDataCampaign | null = null;
    if (this.conn.api_conn) {
      data = await this.conn.api_conn.get(externalUrl).then(async (resp: IHttpResponse) => {
        // new Logger(resp.data).setTag('getFullDataCampaign').log();
        const r = resp.data.data;
        const creatives = await this.conn.api_conn
          ?.get(externalUrlCreative)
          .then((rexpCreative: IHttpResponse) => rexpCreative.data?.data);

        r.creatives = creatives;
        return new FullDataCampaign(r);
      });
    }
    return data;
  }

  /**
   * Получение статуса кампани
   * @param id
   * @returns
   */
  async getStatus(): Promise<ResponceApiNetwork<StatusCampaign>> {
    this.handlerErrNotIdCampaign();
    const responseStatus = await this.getFullDataCampaign(this.id);

    if (responseStatus && responseStatus?.value?.id) {
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
    const fullDataCampaign: FullDataCampaign | null = await this.getFullDataCampaign(this.id);
    const _val = data.value;
    const list = [...new Set(_val?.list ?? [])];
    const type = !!_val?.type;

    if (!fullDataCampaign) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: 'Error get data campaign'
      });
    }
    const { segments, project, mediaType } = fullDataCampaign.value;
    const updateDataCampaign = new UpdateDataCampaign({
      ...fullDataCampaign.value,
      id: String(this.id.value),
      format: '',
      segments: segments ?? [],
      project: project.id,
      mediaType: mediaType.id
    })
      .setPLacements({ list, type })
      .prepare();
    const responseSetPlacement = await this.updateRaw(updateDataCampaign);
    // const dataCamp = responseSetPlacement?.data;
    // const status = responseSetPlacement?.status;

    if (responseSetPlacement?.status === 'OK') {
      this.setPlacementsData(
        new PlacementCampaign({
          list: list ?? [],
          type: type ?? false
        })
      )
        /**
         * TODO: сделать запрос на получение актуального статуса
         */
        .setStatus(new StatusCampaign('stopped'));

      return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
    } else {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
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

  private async changeCampaignStatus(idCampaign: IdCampaign, status: number): Promise<ResponceApiNetwork> {
    const dataDeleteCampaign = {
      ids: [idCampaign.value],
      status // архив
    };
    const externalUrl = 'campaign/status';
    const headers = {
      'Content-Type': 'application/json'
    };
    const responseRemove = await this.conn.api_conn
      ?.put(externalUrl, dataDeleteCampaign, {
        headers
      })
      .then((resp: IHttpResponse) => resp.data);
    const success = responseRemove && responseRemove.status && responseRemove.status === 'OK';

    return new ResponceApiNetwork({
      code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: success ? 'OK' : JSON.stringify(responseRemove)
    });
  }

  /**
   * Точеченое удаление кампании
   * @param id
   * @returns
   */
  private async removeUnit(id: IdCampaign): Promise<ResponceApiNetwork> {
    return await this.changeCampaignStatus(id, 4);
  }

  /**
   * Точеченое удаление креатива
   * @param id
   * @returns
   */
  private async removeCreative(id: string): Promise<ResponceApiNetwork> {
    const dataDeleteCampaign = {
      ids: [id],
      status: 4 // архив
    };
    const externalUrl = 'creative/status';
    const headers = {
      'Content-Type': 'application/json'
    };
    const responseRemove = await this.conn.api_conn
      ?.put(externalUrl, dataDeleteCampaign, {
        headers
      })
      .then((resp: IHttpResponse) => resp.data);
    const success = responseRemove && responseRemove.status && responseRemove.status === 'OK';
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
    return await this.changeCampaignStatus(this.id, 1);
  }

  /**
   * Остановка кампании
   */
  async stop(): Promise<ResponceApiNetwork> {
    this.handlerErrNotIdCampaign();
    return await this.changeCampaignStatus(this.id, 0);
  }

  /**
   * Мин ставка
   * @returns
   */
  async minBid(): Promise<ResponceApiNetwork<BidCampaign>> {
    this.handlerErrNotCountryCampaign();
    return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: new BidCampaign(0.2) });
  }

  /**
   * Статистика
   * @param date
   */
  async stats(date: string): Promise<ResponceApiNetwork<StatsRaw>> {
    this.handlerErrNotIdCampaign();
    const dateComponents = date.split('-');
    const datePrepare = dateComponents[1] + '/' + dateComponents[2] + '/' + dateComponents[0];
    /**
     * ПОлучение данных
     * @param page
     * @returns
     */
    const fwtchData = async (page: number): Promise<FullDataCampaignStats | null> => {
      const externalUrl = `report?groups=spot&filter[from]=${datePrepare}&filter[to]=${datePrepare}&filter[campaign][]=${this.id.value}&page=${page}&limit=3000`;
      let resGetStats = null;
      if (this.conn.api_conn) {
        resGetStats = await this.conn.api_conn
          ?.get(externalUrl)
          .then((d: IHttpResponse) => new FullDataCampaignStats(d.data));
      }
      return resGetStats;
    };

    let page = 1;
    const allData: IResultFullDataCampaignStatsDataItem[] = [];
    while (true) {
      try {
        const dataStats = await fwtchData(page);
        if (!dataStats) {
          return new ResponceApiNetwork({
            code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            message: 'error fwtchData stats'
          });
        }
        if (!dataStats?.value.data.length) {
          // No more data, break the loop
          break;
        }
        allData.push(...dataStats.value.data);
        page++;
      } catch (error) {
        // Handle the error if needed
        return new ResponceApiNetwork({
          code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
          message: 'error fwtchData stats'
        });
      }
    }

    const data = new StatsRaw(
      allData.map((m: IResultFullDataCampaignStatsDataItem) => {
        return {
          report_date: date,
          site_id: m.spot.id,
          impressions: m.impressions,
          cost: m.cost,
          source_id: 0,
          bundle_id: 0,
          id_campaign: String(this.id.value)
        };
      })
    );
    return new ResponceApiNetwork({
      code: RESPONSE_CODES.SUCCESS,
      message: 'OK',
      data
    });
  }
}
