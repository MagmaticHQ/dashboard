import {
  Period,
  getTimestampsFromPeriod,
  getResolutionByPeriod,
} from './dates';
import { Selector, ALL, getChain, getGroup } from './selector';

import { MetricRouteParams } from '@/router';

interface DataRow {
  chain: string;
  protocol: string;
  asset: string | undefined;
  pair: string | undefined;
  values: Record<string, number>;
}
export type Data = DataRow[];

export async function getData(
  routeParams: MetricRouteParams,
  selectors: Selector[],
  period: Period,
): Promise<Data> {
  const url = getUrl(routeParams, selectors, period);
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: 'Bearer 8RuQjvvcqhuwqgYQn87C1NGg',
    },
  });
  const data = await response.json();
  return data;
}

function getUrl(
  routeParams: MetricRouteParams,
  selectors: Selector[],
  period: Period,
): URL {
  const group = getGroup(selectors);
  const chains = getChain(selectors);
  const resolution = getResolutionByPeriod(period);
  const { start, end } = getTimestampsFromPeriod(period);
  const params: any = {
    chains,
    start,
    end,
    resolution,
  };
  const categoryParams = selectors.map((selector) => {
    const paramOptions =
      selector.id === group && selector.selected === ALL
        ? selector.options.map((option) => option.value)
        : [selector.selected];
    return {
      key: selector.id,
      value: paramOptions.join(','),
    };
  });
  for (const param of categoryParams) {
    params[param.key] = param.value;
  }
  const apiEndpoint = (import.meta as any).env.PROD
    ? 'https://api.magmatic.xyz'
    : 'http://localhost:3000';
  const { category, type, dataset } = routeParams;
  const url = new URL(`${apiEndpoint}/v1/${category}/${dataset}/${type}`);
  url.search = new URLSearchParams(params).toString();
  return url;
}
