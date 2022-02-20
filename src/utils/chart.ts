import { Data, DataRow } from './api';
import { Selector } from './selector';

import { Dataset as DatasetType } from '@/router';

interface Dataset {
  [key: string]: number;
}

export type ChartType = 'bar' | 'area' | 'line';

export interface ChartData {
  id: string;
  values: number[];
}

export function getChartType(dataset: DatasetType): ChartType {
  const typeMap: Record<DatasetType, ChartType> = {
    volume: 'bar',
    fees: 'bar',
    liquidity: 'area',
    flow: 'bar',
    supply: 'bar',
    borrow: 'bar',
  };
  return typeMap[dataset];
}

export function getChartTimestamps(
  data: Data,
  selectors: Selector[],
): number[] {
  if (data.length == 0 || !selectors) {
    return [];
  }
  const datasets = getSeriesDatasets(data, selectors);
  if (datasets.findIndex((dataset) => Object.keys(dataset).length === 0) > -1) {
    return [];
  }
  const timestamps = Object.keys(datasets[0]).map(
    (timestamp) => parseInt(timestamp) * 1000,
  );
  return timestamps;
}

export function getChartData(
  data: Data,
  selectors: Selector[],
  groupBy: string,
  ids: string[],
): ChartData[] {
  if (data.length == 0 || !selectors) {
    return [];
  }
  const groupedData = groupData(data, groupBy);
  const datasets = getSeriesDatasets(groupedData, selectors);
  if (datasets.findIndex((dataset) => Object.keys(dataset).length === 0) > -1) {
    return [];
  }
  const chartDataCount = datasets.length;
  const chartData = [];
  for (let i = 0; i < chartDataCount; i++) {
    const id = ids[i];
    const dataset = datasets[i];
    chartData.push({
      id,
      values: Object.keys(dataset).map((timestamp) => dataset[timestamp]),
    });
  }
  return chartData;
}

function groupData(data: Data, groupBy: string): Data {
  function getGroup(row: DataRow, groupBy: string) {
    if (groupBy === 'all') {
      return '';
    }
    if (groupBy === 'asset') {
      return row.asset;
    }
    if (groupBy === 'pair') {
      return row.pair;
    }
    if (groupBy === 'protocol') {
      return row.protocol;
    }
    if (groupBy === 'chain') {
      return row.chain;
    }
    return '';
  }

  const allGroups = data.map((row) => getGroup(row, groupBy));
  const groups = [...new Set(allGroups)];
  const groupedDatasets = groups.map((group) => {
    return data.reduce((groupedRow, row) => {
      const rowGroup = getGroup(row, groupBy);
      if (group !== rowGroup) {
        return groupedRow;
      }
      if (Object.keys(groupedRow).length === 0) {
        return row;
      }
      return {
        ...row,
        values: Object.fromEntries(
          Object.entries(row.values).map((entry) => {
            const [timestamp, value] = entry;
            const sum = value + (groupedRow as any).values[timestamp];
            return [timestamp, sum];
          }),
        ),
      };
    }, {});
  });
  return groupedDatasets as any;
}

function getSeriesDatasets(data: Data, selectors: Selector[]): Dataset[] {
  const keyList = getDatasetKeyList(selectors, data);
  const datasets = keyList.map((keys) => getDataset(data, keys));
  return datasets;
}

function getDatasetKeyList(selectors: Selector[], data: Data): string[][] {
  return data.map((row) => {
    return selectors.map((selector) => {
      const { id } = selector;
      return row[id];
    });
  });
}

function getDataset(data: Data, keys: string[]): Dataset {
  const chainKey = keys[0];
  const protocolKey = keys[1];
  const secondaryKey = keys[2];
  const dataset = data.find(
    (dataset) =>
      dataset.chain === chainKey &&
      dataset.protocol === protocolKey &&
      (dataset.asset === secondaryKey || dataset.pair === secondaryKey),
  )?.values;
  if (!dataset) {
    return {};
  }
  return dataset;
}
