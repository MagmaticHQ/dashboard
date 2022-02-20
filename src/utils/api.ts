import { getTimestampsFromPeriod, getPeriod } from './dates';

export interface DataRow {
  chain: string;
  protocol: string;
  asset: string | undefined;
  pair: string | undefined;
  values: Record<string, number>;
}

export type Data = DataRow[];

async function getAmmAssetVolume(
  chains: string[],
  protocols: string[],
  assets: string[],
): Promise<Data> {
  const params = getAssetParams(chains, protocols, assets);
  return await fetchData('amm/volume/asset', params);
}

async function getAmmPairVolume(
  chains: string[],
  protocols: string[],
  pairs: string[],
): Promise<Data> {
  const params = getPairParams(chains, protocols, pairs);
  return await fetchData('amm/volume/pair', params);
}

async function getAmmLiquidity(
  chains: string[],
  protocols: string[],
  assets: string[],
): Promise<Data> {
  const params = getAssetParams(chains, protocols, assets);
  return await fetchData('amm/liquidity', params);
}

async function getAmmFees(
  chains: string[],
  protocols: string[],
  pairs: string[],
): Promise<Data> {
  const params = getPairParams(chains, protocols, pairs);
  return await fetchData('amm/fees/total', params);
}

async function fetchData(endpoint: string, params: Record<string, string>) {
  const baseUrl = 'https://api.magmatic.xyz/v1';
  const url = new URL(`${baseUrl}/${endpoint}`);
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: 'Bearer 8RuQjvvcqhuwqgYQn87C1NGg',
    },
  });
  const data = await response.json();
  return data;
}

function getAssetParams(
  chains: string[],
  protocols: string[],
  assets: string[],
) {
  const baseParams = getBaseParams(chains, protocols);
  return {
    ...baseParams,
    assets: assets.join(','),
  };
}

function getPairParams(chains: string[], protocols: string[], pairs: string[]) {
  const baseParams = getBaseParams(chains, protocols);
  return {
    ...baseParams,
    pairs: pairs.join(','),
  };
}

function getBaseParams(chains: string[], protocols: string[]) {
  const { start, end } = getTimestampsFromPeriod(getPeriod(30));
  return {
    chains: chains.join(','),
    protocols: protocols.join(','),
    start: start.toString(),
    end: end.toString(),
    resolution: '1d',
  };
}

export { getAmmAssetVolume, getAmmPairVolume, getAmmLiquidity, getAmmFees };
