import { getTimestampsFromPeriod, getPeriod } from './dates';

interface DataRow {
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
  return await fetchData('amm/volume/asset', chains, protocols, assets);
}

async function getAmmLiquidity(
  chains: string[],
  protocols: string[],
  assets: string[],
): Promise<Data> {
  return await fetchData('amm/liquidity/asset', chains, protocols, assets);
}

async function getAmmFees(
  chains: string[],
  protocols: string[],
  assets: string[],
): Promise<Data> {
  return await fetchData('amm/fees/pair', chains, protocols, assets);
}

async function fetchData(
  endpoint: string,
  chains: string[],
  protocols: string[],
  assets: string[],
) {
  const baseUrl = 'https://api.magmatic.xyz/v1';
  const { start, end } = getTimestampsFromPeriod(getPeriod(30));
  const params = {
    chains: chains.join(','),
    protocols: protocols.join(','),
    assets: assets.join(','),
    start: start.toString(),
    end: end.toString(),
    resolution: '1d',
  };
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

export { getAmmAssetVolume, getAmmLiquidity, getAmmFees };
