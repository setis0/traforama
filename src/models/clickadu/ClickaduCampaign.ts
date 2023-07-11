import { RESPONSE_CODES } from '../../consts';
import ClickaduConnection from './ClickaduConnection';
import { ErrorClickadu } from './api/Errors';
import FullDataCampaign from './api/FullDataCampaign';
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

export default class ClickaduCampaign extends Campaign {
  /**
   * Обвноление кампании
   */
  async update(): Promise<ResponceApiNetwork<Campaign>> {
    this.handlerErrNotIdCampaign();
    const fullDataCampaign: FullDataCampaign | null = await this.getFullDataCampaign(this.id);
    if (!fullDataCampaign) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: 'Not get data from network'
      });
    }
    const { name, country, bid, target_url, schedule, placements_data, browser_version } = this.updatedProperties;
    const { rates } = fullDataCampaign.value;
    let code = rates?.[0]?.countries?.map((m: any) => m.id)?.[0];
    const currentBid = rates?.[0]?.amount;
    fullDataCampaign.setRates([
      {
        amount: currentBid,
        countries: [String(code?.toLowerCase())],
        isFutureRate: false
      }
    ]);

    /**
     * NAME
     */
    if (name) {
      fullDataCampaign.setName(String(name.value));
    }
    /**
     * COUNTRU
     */
    if (country) {
      code = String(country.value);
      fullDataCampaign
        .setTargetingCountry({
          list: [
            {
              id: String(code).toLowerCase(),
              title: String(code).toUpperCase(),
              code: String(code).toUpperCase()
            }
          ],
          isExcluded: false
        })
        .setRates([
          {
            amount: currentBid,
            countries: [String(code?.toLowerCase())],
            isFutureRate: false
          }
        ]);
    }
    /**
     * BID
     */
    if (bid) {
      if (country) {
        code = String(country.value);
      }
      if (code) {
        fullDataCampaign.setRates([
          {
            amount: Math.ceil(Number(bid.value) * 100) / 100,
            countries: [String(code?.toLowerCase())],
            isFutureRate: false
          }
        ]);
      }
    }
    /**
     * TARGET_URL
     */
    if (target_url) {
      fullDataCampaign.setTargetUrl(String(target_url.value));
    }
    /**
     * SHECDULE
     */
    if (schedule) {
      fullDataCampaign.setTargetingTimeTable({
        list: schedule.value,
        isExcluded: false
      });
    }
    /**
     * PLACEMENTS DATA
     */
    if (placements_data) {
      const _val = placements_data.value;
      const list = _val?.list;
      const type = _val?.type;

      fullDataCampaign.setTargetingZone({
        list: list ?? [],
        isExcluded: type ?? false
      });
    }
    /**
     * BROWSER VERSION
     */
    if (browser_version) {
      const { name } = fullDataCampaign.value;
      const lowercasedName = name.toLowerCase();

      let type: string | null = null;
      switch (true) {
        case lowercasedName.includes('old ver'):
          type = 'old';
          break;
        case lowercasedName.includes('last ver'):
          type = 'last';
          break;
        case lowercasedName.includes('new ver'):
          type = 'new';
          break;
      }

      if (type) {
        const newVer = Number(browser_version.value);
        const allBrowsers = (await this.getBrowsers('chrome', true))
          .map((m) => Number(m))
          .filter((f) => !isNaN(f))
          .sort((a: number, b: number) => a - b);
        let list: string[] = [];
        switch (type) {
          case 'old':
            list = allBrowsers.filter((f) => f >= 63 && f <= 74).map((m) => `chrome${m}`);
            break;
          case 'new':
            list = allBrowsers.filter((f) => f >= 75 && f <= newVer).map((m) => `chrome${m}`);
            break;
          case 'last':
            list = allBrowsers.filter((f) => f >= 1 && f <= newVer - 1).map((m) => `chrome${m}`);
            break;
        }
        console.log(list);

        fullDataCampaign.setTargetingBrowserVersion({
          list: list.map((m) => {
            return { id: m, title: m, code: m };
          }),
          isExcluded: !['old', 'new'].includes(type)
        });
      }
    }

    fullDataCampaign.setFreqCapType('user').setTargetingConnection('all');

    const responseUpdateCampaign = await this.updateRaw(fullDataCampaign);

    this.updatedProperties = {};

    if (responseUpdateCampaign && responseUpdateCampaign.result && responseUpdateCampaign.result === 'success') {
      return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
    } else {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(responseUpdateCampaign)
      });
    }
  }
  /**
   * Создание кампании
   * @param conn
   * @param data
   * @returns
   */
  async create(
    data: ICampaign,
    schedule: ScheduleCampaign = new ScheduleCampaign()
  ): Promise<ResponceApiNetwork<Campaign>> {
    const { name, template_id, bid, country, placements_data, target_url } = data;

    this.conn.admin_conn?.get('', {}, undefined);

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

    fullDataCampaign
      .setId(String(newIdCampaign.value))
      .setName(String(name.value))
      .setRates([
        {
          amount: Math.ceil(Number(bid.value) * 100) / 100,
          countries: [String(country.value?.toLowerCase())],
          isFutureRate: false
        }
      ])
      .setTargetUrl(target_url.value)
      .setStatus(2)
      .setTargetingCountry({
        list: [
          {
            id: String(country.value).toLowerCase(),
            title: String(country.value).toUpperCase(),
            code: String(country.value).toUpperCase()
          }
        ],
        isExcluded: false
      })
      .setTargetingConnection('all')
      .setTargetingZone({
        list: placements_data.value?.list ?? [],
        isExcluded: placements_data.value?.type ?? false
      })
      .setTargetingTimeTable({
        list: schedule.value,
        isExcluded: false
      })
      .setFreqCapType('user');

    // return fullDataCampaign.value;
    // new Logger({ fullDataCampaign, list: placements_data.value?.list?.length }).log();

    const responseCreateCampaign = await this.updateRaw(fullDataCampaign);

    if (responseCreateCampaign && responseCreateCampaign.result && responseCreateCampaign.result === 'success') {
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
    const { isArchived, status } = data.value;
    return new StatusCampaign(
      isArchived
        ? 'archived'
        : [8, 7, 1].includes(status)
        ? 'stopped'
        : status === 3
        ? 'rejected'
        : status === 2
        ? 'moderation'
        : 'working'
    );
  }

  /**
   * Устаноыка расписания кампании
   * по-умолчанию полное расписание
   * @param schedule
   */
  async updateSchedule(schedule: ScheduleCampaign = new ScheduleCampaign()): Promise<ResponceApiNetwork<Campaign>> {
    this.handlerErrNotIdCampaign();
    const fullDataCampaign: FullDataCampaign | null = await this.getFullDataCampaign(this.id);
    if (!fullDataCampaign) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: 'Not get data from network'
      });
    }
    const { targeting, id, name, rates } = fullDataCampaign.value;
    console.log(targeting.country);
    fullDataCampaign
      .setRates([
        {
          amount: rates?.[0]?.amount,
          isFutureRate: rates?.[0]?.isFutureRate,
          countries: rates?.[0]?.countries.map((m: any) => m.id)
        }
      ])
      .setTargetingTimeTable({
        list: schedule.value,
        isExcluded: false
      })
      .setTargetingZone({
        list: targeting.zone?.list.map((m: any) => m.id) ?? [],
        isExcluded: targeting.zone?.isExcluded ?? false
      })
      .setFreqCapType('user')
      .setTargetingConnection('all');

    const responseUpdateCampaign = await this.updateRaw(fullDataCampaign);

    if (responseUpdateCampaign && responseUpdateCampaign.result && responseUpdateCampaign.result === 'success') {
      this.setId(new IdCampaign(id))
        .setName(new NameCampaign(name))
        .setBid(new BidCampaign(rates?.[0]?.amount))
        .setStatus(this.prepareStatus(fullDataCampaign))
        .setSchedule(schedule);

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
   * Парсинг номера версии браузера из вида chrome105, chrome106 ...
   * @param titleVer
   * @returns
   */
  private parseNameVer(titleVer: string): string {
    return String(titleVer.match(/\d+$/)?.[0]);
  }

  /**
   * Получение всех браузеров сети
   * @param browser
   * @returns
   */
  private async getBrowsers(browser: string = 'chrome', available: boolean = false): Promise<string[]> {
    const externalUrl = `api/v1.0/client/targetings/${available ? 'available' : 'all'}/`;
    const headers = {
      'Content-Type': 'application/json'
    };

    return await this.conn.admin_conn
      ?.get(externalUrl, {
        headers
      })
      .then((resp: { data: any }) =>
        resp?.data?.result?.browserVersion
          ?.filter((f: any) => f?.id.startsWith(browser))
          .map((m: any) => this.parseNameVer(m.id))
      );
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

    const { id, name, targetUrl, status, targeting, rates } = fullDataResponse.value;
    const is_old_ver = name.toLowerCase().indexOf('old ver') !== -1;

    const externalUrl = `api/v1.0/client/targetings/all/`;
    const headers = {
      'Content-Type': 'application/json'
    };
    // console.log(`${this.clientData.baseUrl}${externalUrl}`, this.clientData.token);

    const all_versions: string[] = await this.getBrowsers();

    // const _targeting = request_response?.targeting;
    const actual_list = targeting?.zone;
    const actual_ver = {
      name_ver: this.parseNameVer(targeting.browserVersion.list[targeting.browserVersion.list.length - 1].id),
      type: targeting.browserVersion.isExcluded ? 'last' : 'newORold'
    };
    const actual_ststus = status;

    this.setId(new IdCampaign(id))
      .setName(new NameCampaign(name))
      .setTargetUrl(new TargetUrlCampaign(targetUrl))
      .setCountry(new CountryCampaign(targeting.country.list[0].id))
      .setBid(new BidCampaign(rates?.[0]?.amount))
      .setPlacementsData(
        new PlacementCampaign({
          list: actual_list?.list?.map((m: any) => m?.id) ?? [],
          type: actual_list?.isExcluded ?? false
        })
      )
      .setStatus(this.prepareStatus(fullDataResponse))
      .setSchedule(new ScheduleCampaign(targeting.timeTable.list))
      .setBrowserVersion(
        new BrowserVersionCampaign(
          is_old_ver
            ? null
            : actual_ver.type === 'last'
            ? Number(all_versions.filter((f: any) => Number(f) > Number(actual_ver.name_ver))?.[0])
            : Number(actual_ver.name_ver)
        )
      );

    return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
  }

  /**
   * обновлене кампании
   * @param data
   * @returns
   */
  protected async updateRaw(data: FullDataCampaign): Promise<any> {
    const externalUrl = `api/v2/campaigns/${data.value.id}/`;
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
    const externalUrl = `api/v1.0/client/campaigns/${campaignId.value}/`;
    let data: FullDataCampaign | null = null;
    if (this.conn.admin_conn) {
      data = await this.conn.admin_conn.get(externalUrl).then((resp: IHttpResponse) => {
        const r = resp.data.result;
        return new FullDataCampaign({
          id: r.id,
          name: r.name,
          rates: r.rates,
          targetUrl: r.targetUrl,
          frequency: r.frequency,
          capping: r.capping,
          isArchived: r.isArchived,
          impFrequency: r.impFrequency,
          impCapping: r.impCapping,
          freqCapType: r.freqCapType,
          rateModel: r.rateModel,
          direction: r.direction,
          status: r.status,
          evenlyLimitsUsage: r.evenlyLimitsUsage,
          trafficQuality: r.trafficQuality,
          autoLinkNewZones: r.autoLinkNewZones ?? false,
          isAdblockBuy: r.isAdblockBuy,
          trafficBoost: r.trafficBoost,
          startedAt: r.startedAt,
          feed: r.feed,
          isDSP: r.isDSP,
          trafficVertical: r.trafficVertical,
          targeting: r.targeting
        });
      });

      // new Logger({
      //     url,
      //     headers,
      //     data
      // })
      //     .setTag('getFullDataCampaign')
      //     .setDescription('Получение данных кампании из рекл сети')
      //     .setNetwork(this.constructor.name.toLowerCase())
      //     .setCampaignId(campaignId)
      //     .log();

      // this.customQuery({
      //     url: `${this.clientData.baseUrl}${externalUrl}`,
      //     method: 'get',
      //     headers: {
      //         'Authorization': 'Bearer ' + this.clientData.token
      //     },
      // }, this);
    }
    return data;
  }

  /**
   * Клонирвоание кампании
   * @param campaignId
   * @returns
   */
  private async clone(campaign_id: IdCampaign): Promise<IdCampaign | false> {
    const externalUrlClone = `api/v1.0/client/campaigns/${campaign_id.value}/clone/`;
    const externalUrlGet = `v1.0/api/client/campaigns/?limit=1&page=1&status=draft`;
    const postData = { name: '1' };
    // Клонируем кампанию
    const cloneCampaignId = await this.conn.admin_conn
      ?.post(`${externalUrlClone}`, postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((d: IHttpResponse) => d.data);

    if (cloneCampaignId && cloneCampaignId.result && cloneCampaignId.result === 'success') {
      // Дёргаем ID новосозанной кампании
      const newCampaignId = await this.conn.api_conn?.get(`${externalUrlGet}`).then((d: any) => d.data);
      return newCampaignId.length && newCampaignId?.[0].id ? new IdCampaign(newCampaignId?.[0].id) : false;
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
    const externalUrl = 'api/v2/campaigns/' + this.id.value + '/';
    const responseStatus = await this.conn.api_conn?.get(externalUrl).then((d: IHttpResponse) => d.data);

    const fullDataCampaign = new FullDataCampaign(responseStatus);

    if (fullDataCampaign?.value.id) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.SUCCESS,
        message: 'OK',
        data: this.prepareStatus(fullDataCampaign)
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
    const list = _val?.list;
    const type = _val?.type;
    const typeList = !type ? 'targeted' : 'blocked';
    const externalUrl = `v1.0/api/client/campaigns/${this.id?.value}/${typeList}/zone/`;

    const headers = {
      'Content-Type': 'application/json'
    };

    const responseSetPlacement = await this.conn.api_conn?.put(externalUrl, JSON.stringify(list), {
      headers
    });
    const dataCamp = responseSetPlacement?.data;
    const status = responseSetPlacement?.status;

    if (dataCamp.id) {
      const fullDataCampaign = new FullDataCampaign(dataCamp);
      this.setPlacementsData(
        new PlacementCampaign({
          list: list ?? [],
          type: type ?? false
        })
      ).setStatus(dataCamp.status);

      return new ResponceApiNetwork({ code: RESPONSE_CODES.SUCCESS, message: 'OK', data: this });
    } else {
      return new ResponceApiNetwork({
        code: Number(status),
        message: JSON.stringify(dataCamp)
      });
    }
  }

  /**
   * Удаление кампании
   */
  async remove(): Promise<ResponceApiNetwork> {
    this.handlerErrNotIdCampaign();
    // new Logger(campaignId).setDescription('Clickadu removeCampaign start').log();
    //Получаем статус кампании

    if (!this.status?.value) {
      const responseGetStatus = await this.getStatus().then((d: ResponceApiNetwork) => d.value);
      if (responseGetStatus?.data instanceof StatusCampaign) {
        this.status = responseGetStatus.data;
      } else {
        return new ResponceApiNetwork({
          code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
          message: String(responseGetStatus?.message)
        });
      }
    }

    if (this.status.value === 'archived') {
      return new ResponceApiNetwork({ code: RESPONSE_CODES.BAD_REQUEST, message: 'Campaign already removed' });
    }

    if (this.status.value !== 'moderation') {
      await this.stop();
    } else {
      await this.cancelModeration();
    }
    //Удаляем кампанию
    return await this.removeUnit(this.id);
  }

  /**
   * Точеченое удаление кампании
   * @param id
   * @returns
   */
  private async removeUnit(id: IdCampaign): Promise<ResponceApiNetwork> {
    const listCampaignsFromRemove = { campaignIds: [id.value] };
    const externalUrl = 'api/v1.0/client/campaigns/to_archive/';
    const headers = {
      'Content-Type': 'application/json'
    };
    const responseRemove = await this.conn.admin_conn
      ?.put(externalUrl, listCampaignsFromRemove, {
        headers
      })
      .then((resp: IHttpResponse) => resp.data);
    const success = responseRemove && responseRemove.result && responseRemove.result === 'success';
    return new ResponceApiNetwork({
      code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: success ? 'OK' : JSON.stringify(responseRemove)
    });
  }

  /**
   * Запуск кампании
   */
  async start(): Promise<ResponceApiNetwork> {
    const externalUrl = `api/v2/campaign/${this.id?.value}/change_status/start/`;

    const responseResume = await this.conn.api_conn?.post(externalUrl, {}).then((resp: IHttpResponse) => resp.data);
    // new Logger({
    //     url,
    //     headers,
    //     data: {},
    //     response: responseResume
    // })
    //     .setTag('resumeCampaign')
    //     .setDescription('Запуск кампании в рекл сети')
    //     .setNetwork(this.constructor.name.toLowerCase())
    //     .setCampaignId(campaignId)
    //     .log();

    const success =
      (responseResume && responseResume.result && responseResume.result === 'success') ||
      (responseResume.error && responseResume.error.message.indexOf('rong status for advertiser') !== -1);

    return new ResponceApiNetwork({
      code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: success ? 'OK' : JSON.stringify(responseResume)
    });
  }

  /**
   * Остановка кампании
   */
  async stop(): Promise<ResponceApiNetwork> {
    this.handlerErrNotIdCampaign();
    const externalUrl = `api/v2/campaign/${this.id?.value}/change_status/stop/`;
    const responseStopped = await this.conn.api_conn?.post(externalUrl, {}).then((resp: IHttpResponse) => resp.data);

    const success =
      (responseStopped && responseStopped.result && responseStopped.result === 'success') ||
      responseStopped.error.message?.indexOf('Got: stop') !== -1;

    return new ResponceApiNetwork({
      code: success ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.BAD_REQUEST,
      message: success ? 'OK' : JSON.stringify(responseStopped)
    });
  }

  /**
   * Отмена модерации
   * @param campaignId
   * @returns
   */
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
  }
}
