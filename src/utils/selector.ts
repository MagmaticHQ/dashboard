import config from './config';

import { Dataset, MetricRouteParams } from '@/router';

export const ALL = 'all';
export const OTHERS = '_others';

export interface Selector {
  id: string;
  label: string;
  selected: string;
  options: SelectorOption[];
}

interface SelectorOption {
  value: string;
  text: string;
}

export function getAmmAssetVolumeSelectors(
  chain: string,
  protocol: string,
  asset: string,
): Selector[] {
  return getDataSelectors('amm', 'volume', 'asset', chain, protocol, asset);
}

export function getAmmPairVolumeSelectors(
  chain: string,
  protocol: string,
  pair: string,
): Selector[] {
  return getDataSelectors('amm', 'volume', 'pair', chain, protocol, pair);
}

export function getAmmFeeSelectors(
  chain: string,
  protocol: string,
  asset: string,
): Selector[] {
  return getDataSelectors('amm', 'fees', 'pair', chain, protocol, asset);
}

export function getAmmLiquiditySelectors(
  chain: string,
  protocol: string,
  asset: string,
): Selector[] {
  return getDataSelectors('amm', 'liquidity', 'asset', chain, protocol, asset);
}

function getDataSelectors(
  category: string,
  dataset: Dataset,
  type: string,
  chain: string,
  protocol: string,
  asset: string,
): Selector[] {
  const selectorType = getSelectorType(category, dataset, type);
  const configSelectors = config.selectors.amm[selectorType];
  const datasetSelectors = Object.keys(configSelectors).map((id) => {
    const optionList = configSelectors[id];
    const options = optionList.map((value: string) => {
      const text = config.names[value];
      return {
        value,
        text,
      };
    });
    const selected = id === 'protocols' ? protocol : asset;
    return {
      id,
      label: getCategoryLabel(id),
      selected,
      options,
    };
  });
  const chainSelector = {
    id: 'chain',
    label: 'Network',
    selected: chain,
    options: [
      { value: 'ethereum', text: 'Ethereum' },
      { value: 'polygon', text: 'Polygon' },
    ],
  };
  const selectors = [chainSelector, ...datasetSelectors];
  return selectors;
}

export function getSelectors(routeParams: MetricRouteParams): Selector[] {
  const { category, dataset, type } = routeParams;
  const selectorType = getSelectorType(category, dataset, type);
  const configSelectors = config.selectors[category][selectorType];
  const datasetSelectors = Object.keys(configSelectors).map((id) => {
    const optionList = configSelectors[id];
    const options = optionList.map((value: string) => {
      const text = config.names[value];
      return {
        value,
        text,
      };
    });
    return {
      id,
      label: getCategoryLabel(id),
      selected: ALL,
      options,
    };
  });
  const chainSelector = {
    id: 'chain',
    label: 'Network',
    selected: 'ethereum',
    options: [
      { value: 'ethereum', text: 'Ethereum' },
      { value: 'polygon', text: 'Polygon' },
    ],
  };
  const selectors = [chainSelector, ...datasetSelectors];
  return selectors;
}

export function getChain(selectors: Selector[]): string {
  const chainSelector = selectors.find((selector) => selector.id === 'chain');
  return chainSelector?.selected || 'ethereum';
}

export function getGroup(selectors: Selector[]): string {
  for (const selector of selectors) {
    if (selector.selected === ALL) {
      return selector.id;
    }
  }
  return '';
}

export function getSelectorById(
  selectors: Selector[],
  id: string,
): Selector | undefined {
  return selectors.find((selector) => selector.id === id);
}

function getSelectorType(category: string, dataset: Dataset, type: string) {
  if (category === 'amm') {
    if (dataset === 'volume') {
      return type;
    }
    if (dataset === 'fees') {
      return 'pair';
    }
    return 'asset';
  } else {
    return 'asset';
  }
}

function getCategoryLabel(categoryId: string): string {
  const labelMap: Record<string, string> = {
    protocol: 'Protocol',
    asset: 'Asset',
    pairs: 'Pair',
  };
  return labelMap[categoryId];
}
