import { Data } from './api';
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
  group: string,
  ids: string[],
): ChartData[] {
  if (data.length == 0 || !selectors) {
    return [];
  }
  const datasets = getSeriesDatasets(data, selectors);
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
