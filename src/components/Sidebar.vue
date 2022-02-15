<template>
  <div class="sidebar">
    <div class="header">
      <div
        class="icon"
        @click="toggle"
      >
        <IconCross v-if="isOpen" />
        <IconMenu v-else />
      </div>
      <h1>
        <span class="brand">Magmatic</span>
      </h1>
    </div>
    <div
      class="body"
      :class="{ hidden: !isOpen}"
    >
      <div class="nav">
        <div class="nav-section">
          AMM
        </div>
        <div
          v-for="(route, index) in ammRoutes"
          :key="index"
          class="nav-item"
        >
          <router-link
            class="nav-item-link"
            :class="{ active: isActive(route.params) }"
            :to="{
              name: 'metrics',
              params: route.params,
            }"
          >
            {{ route.name }}
          </router-link>
        </div>

        <div class="nav-section">
          Lending
        </div>
        <div
          v-for="(route, index) in lendingRoutes"
          :key="index"
          class="nav-item"
        >
          <router-link
            class="nav-item-link"
            :class="{ active: isActive(route.params) }"
            :to="{
              name: 'metrics',
              params: route.params,
            }"
          >
            {{ route.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import IconCross from '@/components/icons/IconCross.vue';
import IconMenu from '@/components/icons/IconMenu.vue';
import { MetricRouteParams } from '@/router';

interface Route {
  name: string;
  params: MetricRouteParams;
}

export default defineComponent({
  components: {
    IconCross,
    IconMenu,
  },
  setup() {
    const router = useRouter();

    const isOpen = ref(false);

    function toggle(): void {
      isOpen.value = !isOpen.value;
    }

    function isActive(params: MetricRouteParams): boolean {
      const { dataset, type } = router.currentRoute.value.params;
      return params.dataset === dataset && params.type === type;
    }

    const ammRoutes: Route[] = [
      {
        name: 'Volume by asset',
        params: {
          category: 'amm',
          dataset: 'volume',
          type: 'asset',
        },
      },
      {
        name: 'Volume by pair',
        params: {
          category: 'amm',
          dataset: 'volume',
          type: 'pair',
        },
      },
      {
        name: 'Fees',
        params: {
          category: 'amm',
          dataset: 'fees',
          type: 'total',
        },
      },
      {
        name: 'Gov fees',
        params: {
          category: 'amm',
          dataset: 'fees',
          type: 'gov',
        },
      },
      {
        name: 'Liquidity',
        params: {
          category: 'amm',
          dataset: 'liquidity',
          type: '',
        },
      },
      {
        name: 'Inflow',
        params: {
          category: 'amm',
          dataset: 'flow',
          type: 'in',
        },
      },
      {
        name: 'Outflow',
        params: {
          category: 'amm',
          dataset: 'flow',
          type: 'out',
        },
      },
    ];

    const lendingRoutes: Route[] = [
      {
        name: 'Supply',
        params: {
          category: 'lending',
          dataset: 'supply',
          type: '',
        },
      },
      {
        name: 'Borrow',
        params: {
          category: 'lending',
          dataset: 'borrow',
          type: '',
        },
      },
    ];

    return {
      isOpen,
      toggle,
      isActive,
      ammRoutes,
      lendingRoutes,
    };
  },
});
</script>

<style scoped>
.sidebar {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 288px;
  min-height: 100vh;
  background: var(--background-secondary);
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: center;
  height: 64px;
}

.icon {
  display: none;
}

.brand {
  color: var(--accent);
}

.body {
  margin-bottom: 16px;
}

.nav {
  margin-left: 32px;
}

.nav-section {
  margin-top: 18px;
  margin-bottom: 8px;
  font-size: var(--text-large);
  cursor: default;
}

.nav-item {
  padding-left: 8px;
  border-left: 1px solid var(--border);
  line-height: 1.5;
}

.nav-item-link {
  color: var(--text-secondary);
  font-size: var(--text-small);
  cursor: pointer;
}

.nav-item-link:hover {
  color: var(--accent);
}

.nav-item-link.active {
  color: var(--text-primary);
  font-weight: bold;
  cursor: default;
}

@media (max-width: 1024px) {
  .sidebar {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: initial;
    min-height: initial;
  }

  .header {
    justify-content: initial;
  }

  .icon {
    display: block;
    width: 16px;
    margin: 0 16px;
    cursor: pointer;
  }

  .hidden {
    display: none;
  }
}
</style>
