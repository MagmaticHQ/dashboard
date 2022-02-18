<template>
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
      <Chart
        v-else
        :type="chart.type"
        :is-relative="false"
        :timestamps="chart.timestamps"
        :data="chart.data"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import Chart from '@/components/Chart.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { Dataset } from '@/router';
import { Data, getAmmAssetVolume, getAmmPairVolume, getAmmLiquidity, getAmmFees } from '@/utils/api';
import { getChartType, getChartData, getChartTimestamps } from '@/utils/chart';
import { Selector, getAmmAssetVolumeSelectors, getAmmPairVolumeSelectors, getAmmLiquiditySelectors, getAmmFeeSelectors } from '@/utils/selector';

const route = useRoute();

const protocol = route.params.protocol as string;

const isLoading = ref(true);

interface Input {
  dataset: Dataset;
  chains: string[];
  protocols: string[];
  assets: string[];
  selectorFunc: (chains: string, protocols: string, assets: string) => Selector[];
  fetchFunc: (chains: string[], protocols: string[], assets: string[]) => Promise<Data>;
}

const inputs: Input[] = [{
  dataset: 'volume',
  chains: ['ethereum'],
  protocols: [protocol],
  assets: ['all'],
  selectorFunc: getAmmAssetVolumeSelectors,
  fetchFunc: getAmmAssetVolume,
}, {
  dataset: 'liquidity',
  chains: ['ethereum'],
  protocols: [protocol],
  assets: ['all'],
  selectorFunc: getAmmLiquiditySelectors,
  fetchFunc: getAmmLiquidity,
}, {
  dataset: 'volume',
  chains: ['ethereum', 'polygon'],
  protocols: [protocol],
  assets: ['all'],
  selectorFunc: getAmmAssetVolumeSelectors,
  fetchFunc: getAmmAssetVolume,
}, {
  dataset: 'volume',
  chains: ['ethereum'],
  protocols: [protocol],
  assets: ['dai-usdc', 'dai-usdt', 'usdc-usdt', 'eth-seth', 'wbtc-sbtc'],
  selectorFunc: getAmmPairVolumeSelectors,
  fetchFunc: getAmmPairVolume,
}, {
  dataset: 'fees',
  chains: ['ethereum'],
  protocols: [protocol],
  assets: ['all'],
  selectorFunc: getAmmFeeSelectors,
  fetchFunc: getAmmFees,
}, {
  dataset: 'liquidity',
  chains: ['ethereum'],
  protocols: [protocol],
  assets: ['dai', 'usdc', 'usdt', 'eth', 'seth', 'wbtc', 'sbtc'],
  selectorFunc: getAmmLiquiditySelectors,
  fetchFunc: getAmmLiquidity,
}];

const data = ref<Data[]>(inputs.map(() => []));

const charts = computed(() => {
  return data.value.map((row, index) => {
    const input = inputs[index];
    return {
      type: getChartType(input.dataset),
      timestamps: getChartTimestamps(input.dataset, row, input.selectorFunc(input.chains[0], input.protocols[0], input.assets[0])),
      data: getChartData(input.dataset, row, input.selectorFunc(input[0], input[1], input[2])),
    };
  });
});

async function fetchData(): Promise<void> {
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    data.value[i] = await input.fetchFunc(input.chains, input.protocols, input.assets);
  }
  isLoading.value = false;
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
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
