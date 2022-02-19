<template>
  <div>
    <h2>{{ title }}</h2>
    <div class="chart">
      <ApexChart
        width="100%"
        height="100%"
        :type="type"
        :options="options"
        :series="series"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, toRefs, computed } from 'vue';
import ApexChart from 'vue3-apexcharts';

import { ChartData, ChartType } from '@/utils/chart';
import config from '@/utils/config';

export default defineComponent({
  components: {
    ApexChart,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<ChartType>,
      default: 'bar',
    },
    isRelative: {
      type: Boolean,
      default: false,
    },
    timestamps: {
      type: Array as PropType<number[]>,
      required: true,
    },
    data: {
      type: Array as PropType<ChartData[]>,
      required: true,
    },
  },
  setup(props) {
    const { type, isRelative, timestamps, data } = toRefs(props);

    const series = computed(() => {
      const totals = data.value.reduce((totals, a) => {
        return a.values.map((value, index) => {
          const total = totals[index] || 0;
          return total + value;
        });
      }, new Array<number>(timestamps.value.length));
      return data.value.map((a) => {
        const { id, values } = a;
        return {
          name: getName(id),
          data: isRelative.value
            ? values.map((value, index) => value / totals[index])
            : values,
        };
      });
    });

    const options = computed(() => {
      return {
        chart: {
          id: 'chart',
          type: type.value,
          stacked: true,
          stackType: 'normal',
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          fontFamily: 'Sarabun, Helvetica, Arial, sans-serif',
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: false,
          },
          categories: timestamps.value,
        },
        yaxis: {
          labels: {
            formatter: isRelative.value ? formatShare : formatValue,
          },
          min: isRelative.value ? 0 : undefined,
          max: isRelative.value ? 1 : undefined,
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          onItemHover: {
            highlightDataSeries: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: getColors(data.value),
        fill: {
          type: 'solid',
          opacity: 1,
        },
        stroke: {
          show: false,
        },
      };
    });

    function formatValue(value: number) {
      const valueFormat = new Intl.NumberFormat('en-US', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        notation: 'compact',
        style: 'currency',
        currency: 'usd',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
      return valueFormat.format(value);
    }

    function formatShare(value: number) {
      const valueFormat = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      });
      return valueFormat.format(value);
    }

    function formatDate(timestamp: number) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      } as Intl.DateTimeFormatOptions;
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', options);
    }

    function getName(id: string): string {
      return config.names[id];
    }

    function getColors(data: ChartData[]): string[] {
      const { defaultColor, colors } = config;
      return data.map((dataRow) => {
        return colors[dataRow.id] ? colors[dataRow.id] : defaultColor;
      });
    }

    return {
      series,
      options,
    };
  },
});
</script>

<style scoped>
.chart {
  height: 240px;
}

h2 {
  margin: 8px;
}
</style>

<style>
.apexcharts-text tspan,
.apexcharts-yaxis-label tspan,
.apexcharts-xaxis-label tspan {
  fill: var(--text-secondary);
}

.apexcharts-gridline {
  stroke: var(--text-secondary);
  opacity: 0.15;
}

.apexcharts-legend-text {
  color: var(--text-secondary) !important;
}

.apexcharts-tooltip {
  width: 160px;
  border: none !important;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  font-size: var(--text-tiny);
}

.tooltip-header {
  padding: 8px;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  background: var(--background-primary);
  color: var(--text-secondary);
}

.tooltip-body {
  background: var(--background-secondary);
  color: var(--text-secondary);
}

.tooltip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: var(--background-secondary);
}

.tooltip-item-title {
  display: flex;
  align-items: center;
}

.tooltip-item-logo {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  border-radius: 4px;
}

.tooltip-total {
  padding: 4px 24px;
}
</style>
