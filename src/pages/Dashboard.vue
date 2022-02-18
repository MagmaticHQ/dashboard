<template>
  <div class="chart">
    <LoadingIndicator
      class="loader"
      v-if="isLoading"
    />
    <Chart
      v-else
      :type="chart.type"
      :is-relative="false"
      :timestamps="chart.timestamps"
      :data="chart.data"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

import Chart from '@/components/Chart.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { Data, getAmmAssetVolume } from '@/utils/api';
import { getChartType, getChartData, getChartTimestamps } from '@/utils/chart';
import { getAmmAssetVolumeSelectors } from '@/utils/selector';

const isLoading = ref(true);

const chart = reactive({
  type: computed(() => getChartType('volume')),
  timestamps: computed(() =>
    getChartTimestamps(
      'volume',
      state.value,
      getAmmAssetVolumeSelectors('ethereum', 'all', 'all'),
    ),
  ),
  data: computed(() =>
    getChartData('volume', state.value, getAmmAssetVolumeSelectors('ethereum', 'all', 'all')),
  ),
});

const state = ref<Data>([]);

async function fetchData(): Promise<void> {
  state.value = [];
  const totalVolume = await getAmmAssetVolume(['ethereum'], ['all'], ['all']);
  state.value = totalVolume;
  isLoading.value = false;
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.chart {
  height: 512px;
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
