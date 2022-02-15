import { createWebHistory, createRouter } from 'vue-router';

import Login from './pages/Login.vue';
import Metrics from './pages/Metrics.vue';

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
      redirect: {
        name: 'metrics',
        params: {
          category: 'amm',
          dataset: 'volume',
          type: 'asset',
        },
      },
    },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/metrics/:category/:dataset/:type?',
      name: 'metrics',
      component: Metrics,
    },
    {
      path: '/data/:pathMatch(.*)*',
      redirect: {
        name: 'home',
      },
    },
  ],
});
