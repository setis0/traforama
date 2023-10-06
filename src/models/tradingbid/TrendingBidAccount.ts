import { RESPONSE_CODES } from '../../consts';
import {
  IHttpResponse,
  Account,
  BalanceAccount,
  ResponceApiNetwork,
  StatsAccount
} from '@atsorganization/ats-lib-ntwk-common';
import FullDataCampaignStats, {
  IResultFullDataCampaignStatsDataItem,
  IResultFullDataCampaignStatsDataItemStat
} from './api/FullDataCampaignStats';

export default class TrendingBidAccount extends Account {
  /**
   * Получение баласна
   */
  async getBalance(): Promise<ResponceApiNetwork<BalanceAccount>> {
    const externalUrl = 'api/user/getprofile';
    const responseBalance = await this.conn.admin_conn?.get(externalUrl).then((resp: IHttpResponse) => resp.data);

    const account = responseBalance?.data;

    const balance = account?.balance ? String(account?.balance)?.replace('~', '') : undefined;

    if (balance) {
      this.setBalance(new BalanceAccount(Number(balance)));
    }
    return new ResponceApiNetwork({
      code: balance ? RESPONSE_CODES.SUCCESS : RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      message: balance ? 'OK' : JSON.stringify(responseBalance),
      data: balance ? new BalanceAccount(Number(balance)) : undefined
    });
  }

  /**
   * Получить данные аккаунта из сети
   */
  fetch(): Promise<ResponceApiNetwork<Account>> {
    throw new Error('Method not implemented.');
  }

  /**
   * Статистика по аккаунту
   * @param dateFrom
   * @param dateTo
   */
  async stats(dateFrom: string, dateTo: string): Promise<ResponceApiNetwork<StatsAccount>> {
    const datesPrepare = [dateFrom, dateTo];
    for (let i = 0; i < datesPrepare.length; i++) {
      const dateComponents = datesPrepare[i].split('-');
      datesPrepare[i] = dateComponents[2] + '.' + dateComponents[1] + '.' + dateComponents[0];
    }
    const externalUrl = `api/statistics/index`;

    const prepareReportData = async (
      datesReport: string[]
    ): Promise<IResultFullDataCampaignStatsDataItem | undefined> => {
      const getReportData = async (): Promise<FullDataCampaignStats | undefined> => {
        return await this.conn.admin_conn
          ?.post(externalUrl, {})
          .then((d: IHttpResponse) => new FullDataCampaignStats(d.data));
      };
      const responseDataStatsReport = await getReportData();
      if (responseDataStatsReport?.value?.code !== 200) {
        return;
      }
      const filterCondition = {
        counter: {
          comparisonOperator: '<>',
          name: '',
          value: [datesReport[1], datesReport[0]]
        }
      };

      const customDataGetStats = responseDataStatsReport.value.data;
      customDataGetStats.date.start = datesReport[0];
      customDataGetStats.date.end = datesReport[1];

      customDataGetStats.using.forEach((el: any) => {
        if (el.name === 'date') {
          el.filter.fromCondition = filterCondition;
        }
      });

      // customDataGetStats.notUsing = customDataGetStats.notUsing.filter(
      //   (f: any) => !['impAdCampaignId', 'impSourceHash'].includes(f.name)
      // );

      customDataGetStats.table.data = [];
      customDataGetStats.table.columns.forEach((el: any) => {
        if (el.name === 'date') {
          el.filter.fromCondition = filterCondition;
        }
      });

      customDataGetStats.table.columns = customDataGetStats.table.columns.filter((f: any) =>
        ['date', 'eventView', 'advertiserAllPayments'].includes(f.name)
      );
      // customDataGetStats.templateId = '';
      return customDataGetStats;
    };
    const prepareDataStat = await prepareReportData(datesPrepare);

    if (!prepareDataStat) {
      return new ResponceApiNetwork({
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        message: 'error fwtchData stats'
      });
    }

    /**
     * ПОлучение данных
     * @param page
     * @returns
     */
    const fwtchData = async (page: number): Promise<FullDataCampaignStats | null> => {
      prepareDataStat.table.pagination.page = page;

      let resGetStats = null;
      if (this.conn.admin_conn) {
        resGetStats = await this.conn.admin_conn
          ?.post(externalUrl, prepareDataStat, {
            'Content-Type': 'application/json',
            'x-requested-with': 'XMLHttpRequest'
          })
          .then((d: IHttpResponse) => new FullDataCampaignStats(d.data));
      }
      // console.log(prepareDataStat);
      return resGetStats;
    };

    let page = 1;
    const allData: IResultFullDataCampaignStatsDataItemStat[] = [];
    while (true) {
      try {
        const dataStats = await fwtchData(page);
        if (!dataStats) {
          return new ResponceApiNetwork({
            code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            message: 'error fwtchData stats'
          });
        }
        // console.log(dataStats?.value?.data?.table?.data);
        if (!dataStats?.value?.data?.table?.data?.length) {
          // No more data, break the loop
          break;
        }
        prepareDataStat.templateId = '';
        prepareDataStat.reportId = dataStats.value.data.reportId;
        allData.push(...dataStats.value?.data?.table?.data);
        page++;
      } catch (error) {
        // Handle the error if needed
        return new ResponceApiNetwork({
          code: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
          message: 'error fwtchData stats'
        });
      }
    }
    // console.log(allData);
    const statsArr = allData.reduce(
      (ac: any, el: IResultFullDataCampaignStatsDataItemStat) => {
        ac.cost += Number(el.advertiserAllPayments);
        ac.impressions += Number(el.eventView);
        return ac;
      },
      { cost: 0, impressions: 0 }
    );

    const data = new StatsAccount({
      cost: statsArr.cost,
      impressions: statsArr.impressions,
      report_date: dateFrom + '-' + dateTo
    });
    return new ResponceApiNetwork({
      code: RESPONSE_CODES.SUCCESS,
      message: 'OK',
      data
    });
  }
}
