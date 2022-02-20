<template>
  <div class="page">
    <h1>{{ protocolName }}</h1>
    <div class="list">
      <div
        v-for="(chart, index) in charts"
        :key="index"
        class="chart"
      >
        <LoadingIndicator
          v-if="isLoading"
          class="loader"
        />
        <ChartDataset
          v-else
          :title="chart.title"
          :type="chart.type"
          :is-relative="false"
          :timestamps="chart.timestamps"
          :data="chart.data"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import ChartDataset from '@/components/ChartDataset.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { Dataset } from '@/router';
import { Data, getAmmAssetVolume, getAmmPairVolume, getAmmLiquidity, getAmmFees } from '@/utils/api';
import { getChartType, getChartData, getChartTimestamps } from '@/utils/chart';
import { Selector, getAmmAssetVolumeSelectors, getAmmPairVolumeSelectors, getAmmLiquiditySelectors, getAmmFeeSelectors } from '@/utils/selector';

const route = useRoute();

const protocol = route.params.protocol as string;

const isLoading = ref(true);

interface Input {
  title: string;
  dataset: Dataset;
  chains: string[];
  protocols: string[];
  assets: string[];
  group: string;
  ids: string[];
  selectorFunc: (chains: string, protocols: string, assets: string) => Selector[];
  fetchFunc: (chains: string[], protocols: string[], assets: string[]) => Promise<Data>;
}

const protocolNames = {
  'curve': 'Curve',
  'balancer': 'Balancer',
  'uniswap': 'Uniswap',
  'quickswap': 'Quickswap',
  'sushiswap': 'Sushiswap',
};

const protocolName = protocolNames[protocol];

const protocolVersions = {
  'curve': ['curve:1', 'curve:2'],
  'balancer': ['balancer:1', 'balancer:2'],
  'uniswap': ['uniswap:1', 'uniswap:2', 'uniswap:3'],
  'quickswap': ['quickswap:1'],
  'sushiswap': ['sushiswap:1'],
};

const protocolAssets = {
  'curve': ['dai', 'usdc', 'usdt', 'weth', 'seth', 'wbtc', 'sbtc'],
  'balancer': ['weth', 'wbtc', 'dai', 'usdc', 'usdt', 'bal'],
  'uniswap': ['weth', 'usdc', 'dai', 'usdt', 'wbtc'],
  'quickswap': ['weth', 'usdc', 'dai', 'usdt', 'wbtc'],
  'sushiswap': ['weth', 'usdc', 'dai', 'usdt', 'wbtc'],
};

const protocolPairs = {
  'curve': ['usdc-dai', 'usdt-dai', 'usdt-usdc', 'weth-seth', 'sbtc-wbtc'],
  'balancer': ['wbtc-weth', 'usdc-dai', 'usdt-dai', 'usdt-usdc', 'dai-weth', 'bal-weth'],
  'uniswap': ['usdc-dai', 'usdc-weth', 'wbtc-weth', 'usdt-usdc', 'usdt-weth', 'wbtc-usdc'],
  'quickswap': ['wbtc-weth', 'usdc-weth', 'usdc-mimatic', 'usdt-weth', 'usdt-usdc', 'dai-weth'],
  'sushiswap': ['usdc-weth', 'wbtc-weth', 'usdt-weth', 'dai-weth', 'sushi-weth', 'aave-weth'],
};

const chains = ['ethereum', 'polygon'];

const inputs: Input[] = [{
  title: 'Total volume',
  dataset: 'volume',
  chains,
  protocols: protocolVersions[protocol],
  assets: ['all'],
  group: 'all',
  ids: [protocol],
  selectorFunc: getAmmAssetVolumeSelectors,
  fetchFunc: getAmmAssetVolume,
}, {
  title: 'Liquidity (TVL)',
  dataset: 'liquidity',
  chains,
  protocols: protocolVersions[protocol],
  assets: ['all'],
  group: 'all',
  ids: [protocol],
  selectorFunc: getAmmLiquiditySelectors,
  fetchFunc: getAmmLiquidity,
}, {
  title: 'Volume, by network',
  dataset: 'volume',
  chains,
  protocols: protocolVersions[protocol],
  assets: ['all'],
  group: 'chain',
  ids: ['ethereum', 'polygon'],
  selectorFunc: getAmmAssetVolumeSelectors,
  fetchFunc: getAmmAssetVolume,
}, {
  title: 'Volume, by pair',
  dataset: 'volume',
  chains,
  protocols: protocolVersions[protocol],
  assets: protocolPairs[protocol],
  group: 'pair',
  ids: protocolPairs[protocol],
  selectorFunc: getAmmPairVolumeSelectors,
  fetchFunc: getAmmPairVolume,
}, {
  title: 'Swap fees',
  dataset: 'fees',
  chains,
  protocols: protocolVersions[protocol],
  assets: ['all'],
  group: 'pair',
  ids: [protocol],
  selectorFunc: getAmmFeeSelectors,
  fetchFunc: getAmmFees,
}, {
  title: 'Liquidity, by asset',
  dataset: 'liquidity',
  chains,
  protocols: protocolVersions[protocol],
  assets: protocolAssets[protocol],
  group: 'asset',
  ids: protocolAssets[protocol],
  selectorFunc: getAmmLiquiditySelectors,
  fetchFunc: getAmmLiquidity,
}];

const data = ref<Data[]>(inputs.map(() => []));

const charts = computed(() => {
  return data.value.map((row, index) => {
    const input = inputs[index];
    const selectors = input.selectorFunc(input.chains[0], input.protocols[0], input.assets[0]);
    return {
      title: input.title,
      type: getChartType(input.dataset),
      timestamps: getChartTimestamps(row, selectors),
      data: getChartData(row, selectors, input.group, input.ids),
    };
  });
});

async function fetchData(): Promise<void> {
  const results: Data[] = [];
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    results[i] = await input.fetchFunc(input.chains, input.protocols, input.assets);
  }
  data.value = results;
  isLoading.value = false;
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}

.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 32px;
}

.chart {
  width: 100%;
  max-width: 580px;
  height: 300px;
  margin-top: 16px;
  padding: 8px 0;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background-secondary);
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
