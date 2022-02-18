import { createWebHistory, createRouter } from 'vue-router';

import Dashboard from './pages/Dashboard.vue';

export type Dataset =
  | 'volume'
  | 'fees'
  | 'liquidity'
  | 'flow'
  | 'supply'
  | 'borrow';

export interface MetricRouteParams {
  category: string;
  dataset: Dataset;
  type: string;
}

const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'dashboard', params: { protocol: 'uniswap' } },
    },
    { path: '/:protocol', name: 'dashboard', component: Dashboard },
  ],
});
