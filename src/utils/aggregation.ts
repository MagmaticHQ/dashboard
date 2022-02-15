import { ChartData } from './chart';

import { Dataset } from '@/router';

export type AggregatedData = Record<string, number>;

export function getTotal(dataset: Dataset, data: ChartData[]): AggregatedData {
  const funcMap: Record<Dataset, (values: number[]) => number> = {
    volume: getSum,
    fees: getSum,
    liquidity: getAverage,
    flow: getSum,
    supply: getSum,
    borrow: getSum,
  };
  const func = funcMap[dataset];
  const total = Object.fromEntries(
    data.map((dataItem) => [dataItem.id, func(dataItem.values)]),
  );
  return total;
}

function getAverage(values: number[]): number {
  const sum = getSum(values);
  return sum / values.length;
}

function getSum(values: number[]): number {
  return values.reduce((sum, value) => sum + value);
}
