import { createApp } from 'vue';

import App from './App.vue';
import { router } from './router';

import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';

const app = createApp(App);

app.use(router);

app.mount('#app');
