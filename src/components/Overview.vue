<template>
  <div class="overview">
    <div class="cards">
      <h4>{{ header }}</h4>
      <div class="card-list">
        <div
          v-for="(value, protocol) in values"
          :key="protocol"
          class="card"
        >
          <div class="card-text">
            {{ getName(protocol.toString()) }}
          </div>
          <div class="card-value">
            {{ format(value) }}
          </div>
        </div>
      </div>
    </div>
    <div class="table">
      <table cellspacing="0">
        <tr class="row-header">
          <th class="column-text">
            Protocol
          </th>
          <th class="column-value">
            {{ header }}
          </th>
        </tr>
        <tr
          v-for="(value, protocol) in values"
          :key="protocol"
          class="row"
        >
          <td class="column-text">
            {{ getName(protocol.toString()) }}
          </td>
          <td class="column-value">
            {{ format(value) }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, toRefs, computed } from 'vue';

import { Dataset } from '@/router';
import { AggregatedData } from '@/utils/aggregation';
import config from '@/utils/config';

export default defineComponent({
  props: {
    dataset: {
      type: String as PropType<Dataset>,
      required: true,
    },
    data: {
      type: Object as PropType<AggregatedData>,
      required: true,
    },
    isRelative: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { dataset, data, isRelative } = toRefs(props);

    function getName(id: string): string {
      return config.names[id];
    }

    function format(value: number) {
      return isRelative.value ? formatShare(value) : formatValue(value);
    }

    function formatShare(value: number) {
      const valueFormat = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      });
      return valueFormat.format(value);
    }

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

    const header = computed(() => {
      const map: Record<Dataset, string> = {
        volume: 'Total volume',
        fees: 'Total fees',
        liquidity: 'Average liquidity',
        flow: 'Total flow',
      };
      return map[dataset.value];
    });

    const values = computed(() => {
      const total = Object.values(data.value).reduce(
        (total, value) => total + value,
      );
      const values = Object.fromEntries(
        Object.entries(data.value)
          .map((entry) => {
            const [id, value] = entry;
            const a = isRelative.value ? [id, value / total] : [id, value];
            return a as [string, number];
          })
          .sort((a, b) => b[1] - a[1]),
      );
      return values;
    });

    return {
      header,
      values,
      getName,
      format,
    };
  },
});
</script>

<style scoped>
.overview {
  display: flex;
  color: var(--text-secondary);
}

.cards {
  padding: 8px;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background-secondary);
}

.card-list {
  display: flex;
  margin-top: 8px;
}

.card {
  width: 128px;
  margin-right: 16px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
}

.card:last-child {
  margin-right: 0;
}

.card-text {
  font-size: var(--text-tiny);
}

.card-value {
  font-size: var(--text-large);
}

.table {
  display: none;
  min-width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background-secondary);
}

table {
  width: 100%;
}

.row-header {
  background: var(--background-primary);
}

.row {
  border-bottom: 1px solid var(--background-primary);
}

th,
td {
  padding: 8px 16px;
}

.column-text {
  text-align: left;
}

.column-value {
  text-align: right;
}

@media (max-width: 768px) {
  .cards {
    display: none;
  }

  .table {
    display: initial;
  }
}
</style>
