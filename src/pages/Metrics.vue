<template>
  <div class="page">
    <div class="header">
      <h1>
        {{ title }}
      </h1>
      <span class="mode-selector">
        <span
          class="mode"
          :class="{ active: !isRelative }"
          @click="setRelative(false)"
        >Absolute</span>
        <span
          class="mode"
          :class="{ active: isRelative }"
          @click="setRelative(true)"
        >Relative</span>
      </span>
    </div>
    <div class="selectors">
      <div
        v-if="selectors"
        class="selector-group"
      >
        <Select
          v-for="selector in selectors"
          :key="selector.id"
          v-model="selector.selected"
          class="selector"
          :label="selector.label"
          :options="selector.options"
          @change="onSelectorChange"
        />
      </div>
      <div
        class="selector-group"
      >
        <DateSelect
          v-model="period"
          class="selector"
          @change="onSelectorChange"
        />
      </div>
    </div>
    <div
      v-if="Object.keys(state).length"
      class="chart"
    >
      <Chart
        :type="chart.type"
        :is-relative="isRelative"
        :timestamps="chart.timestamps"
        :data="chart.data"
      />
    </div>
    <div
      v-else
      class="loading-indicator"
    >
      <LoadingIndicator />
    </div>
    <div
      v-if="Object.keys(state).length"
      class="overview"
    >
      <Overview
        :dataset="overview.dataset"
        :data="overview.data"
        :is-relative="isRelative"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

import Chart from '@/components/Chart.vue';
import DateSelect from '@/components/DateSelect.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import Overview from '@/components/Overview.vue';
import Select from '@/components/Select.vue';
import { MetricRouteParams } from '@/router';
import { getTotal } from '@/utils/aggregation';
import { Data } from '@/utils/api';
import { getChartType, getChartData, getChartTimestamps } from '@/utils/chart';
import { getPeriod } from '@/utils/dates';
import { getSelectors } from '@/utils/selector';

function getTitle(params: MetricRouteParams): string {
  if (params.category === 'amm') {
    if (params.dataset === 'volume') {
      if (params.type === 'asset') {
        return 'Volume by asset';
      }
      if (params.type === 'pair') {
        return 'Volume by pair';
      }
    }
    if (params.dataset === 'fees') {
      return 'Fees';
    }
    if (params.dataset === 'liquidity') {
      return 'Liquidity';
    }
    if (params.dataset === 'flow') {
      if (params.type === 'in') {
        return 'Inflow';
      }
      if (params.type === 'out') {
        return 'Outflow';
      }
      return 'Inflow';
    }
  }
  if (params.category === 'lending') {
    if (params.dataset === 'supply') {
      return 'Supply';
    }
    if (params.dataset === 'borrow') {
      return 'Borrow';
    }
  }
  return '';
}

export default defineComponent({
  components: {
    Chart,
    DateSelect,
    LoadingIndicator,
    Overview,
    Select,
  },
  setup() {
    const route = useRoute();
    const routeParams = ref<MetricRouteParams>(route.params as any);

    const title = computed(() => getTitle(routeParams.value));

    const isRelative = ref(false);
    const period = ref(getPeriod(30));
    const selectors = ref(getSelectors(routeParams.value));

    const state = ref<Data>([]);

    const chart = reactive({
      type: computed(() => getChartType(routeParams.value.dataset)),
      timestamps: computed(() =>
        getChartTimestamps(
          routeParams.value.dataset,
          state.value,
          selectors.value,
        ),
      ),
      data: computed(() =>
        getChartData(routeParams.value.dataset, state.value, selectors.value),
      ),
    });

    const overview = reactive({
      dataset: computed(() => routeParams.value.dataset),
      data: computed(() => getTotal(routeParams.value.dataset, chart.data)),
    });

    async function fetchData(): Promise<void> {
      state.value = [];
      const data = await getData(
        routeParams.value,
        selectors.value,
        period.value,
      );
      state.value = data;
    }

    onMounted(() => {
      selectors.value = getSelectors(routeParams.value);
      fetchData();
    });

    onBeforeRouteUpdate((to) => {
      routeParams.value = to.params as any;
      selectors.value = getSelectors(routeParams.value);
      fetchData();
    });

    function setRelative(relative: boolean): void {
      isRelative.value = relative;
    }

    function onSelectorChange(): void {
      fetchData();
    }

    return {
      title,

      isRelative,
      selectors,
      period,

      setRelative,
      onSelectorChange,

      state,
      chart,
      overview,
    };
  },
});
</script>

<style scoped>
.page {
  margin-bottom: 16px;
}

.header {
  display: flex;
  align-items: baseline;
}

.mode-selector {
  margin-left: 32px;
  color: var(--text-secondary);
  font-size: var(--text-large);
  cursor: pointer;
}

.mode:not(:first-child) {
  margin-left: 16px;
}

.mode:hover {
  color: var(--accent);
}

.mode.active {
  color: var(--text-primary);
  text-decoration: underline;
  cursor: default;
}

.selectors {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.selector-group {
  display: flex;
}

.selector:not(:first-child) {
  margin-left: 16px;
}

.chart,
.loading-indicator {
  height: 512px;
  margin-top: 16px;
  padding: 8px 0;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background-secondary);
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.overview {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .header {
    display: initial;
  }

  .mode-selector {
    margin-left: 0;
  }

  .selectors {
    display: flex;
    flex-direction: column;
  }

  .selector-group:not(:first-child) {
    margin-top: 16px;
  }

  .chart,
  .loading-indicator {
    height: 400px;
  }
}
</style>
