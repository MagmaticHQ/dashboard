declare module '*.vue' {
  import { ComponentOptions } from 'vue';

  const component: ComponentOptions;
  export default component;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare const API_ENDPOINT: boolean;
