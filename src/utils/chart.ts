import { Data } from './api';
import { Selector, ALL, OTHERS, getGroup } from './selector';

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
  dataset: DatasetType,
  data: Data,
  selectors: Selector[],
): number[] {
  if (data.length == 0 || !selectors) {
    return [];
  }
  const group = getGroup(selectors);
  const datasets = getSeriesDatasets(dataset, data, selectors, group);
  if (datasets.findIndex((dataset) => Object.keys(dataset).length === 0) > -1) {
    return [];
  }
  const timestamps = Object.keys(datasets[0]).map(
    (timestamp) => parseInt(timestamp) * 1000,
  );
  return timestamps;
}

export function getChartData(
  dataset: DatasetType,
  data: Data,
  selectors: Selector[],
): ChartData[] {
  if (data.length == 0 || !selectors) {
    return [];
  }
  const group = getGroup(selectors);
  const ids = getSeriesIds(selectors, group);
  const datasets = getSeriesDatasets(dataset, data, selectors, group);
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

function getSeriesDatasets(
  dataset: DatasetType,
  data: Data,
  selectors: Selector[],
  group: string,
): Dataset[] {
  const keyList = getDatasetKeyList(selectors, data);
  const datasets = keyList.map((keys) => getDataset(data, keys));
  const othersDataset = getOthersDataset(
    dataset,
    data,
    datasets,
    selectors,
    group,
  );
  return Object.keys(othersDataset).length > 0
    ? [...datasets, othersDataset]
    : datasets;
}

function getSeriesIds(selectors: Selector[], group: string): string[] {
  const activeSelector = selectors.find((selector) => selector.id === group);
  if (!activeSelector) {
    return [''];
  }
  if (activeSelector.selected !== ALL) {
    const selectedOption = activeSelector.options.find(
      (option) => option.value === activeSelector.selected,
    );
    if (!selectedOption) {
      return [''];
    }
    return [selectedOption.value];
  }
  const ids = activeSelector.options
    .filter((option) => option.value !== ALL)
    .map((option) => option.value);
  ids.push(OTHERS);
  return ids;
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

function getOthersDataset(
  dataset: DatasetType,
  data: Data,
  datasets: Dataset[],
  selectors: Selector[],
  group: string,
): Dataset {
  if (!group || datasets.length === 0) {
    return {};
  }

  const activeSelector = selectors.find((selector) => selector.id === group);
  if (!activeSelector || activeSelector.selected !== ALL) {
    return {};
  }

  const timestamps = Object.keys(datasets[0]);
  const allDatasetKeys = selectors.map((selector) =>
    selector.id === group ? ALL : selector.selected,
  );
  const allDataset = getDataset(data, allDatasetKeys);

  const othersDataset = {};
  for (const timestamp of timestamps) {
    const allValue =
      dataset === 'volume' && group === 'assets'
        ? 2 * allDataset[timestamp]
        : allDataset[timestamp];
    const nonOthersValue = datasets.reduce((total, dataset) => {
      return total + dataset[timestamp];
    }, 0);
    const othersValue = Math.max(allValue - nonOthersValue, 0);
    othersDataset[timestamp] = othersValue;
  }
  return othersDataset;
}
