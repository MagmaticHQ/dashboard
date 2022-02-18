<template>
  <div class="app">
    <router-view
      class="view"
      :class="{ full: !isSidebarShown }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import '@fontsource/sarabun/400.css';
import '@fontsource/sarabun/700.css';

export default defineComponent({
  setup() {
    const route = useRoute();

    const isSidebarShown = computed(() => {
      const routeName = route.name;
      return routeName !== 'login';
    });

    return {
      isSidebarShown,
    };
  },
});
</script>

<style>
:root {
  --lava: #980b17;
  --lapis: #2f619b;
  --oxford: #002147;
  --pastel: #f4f4f5;
  --white: #fff;
  --accent: var(--lava);
  --text-primary: var(--oxford);
  --text-secondary: var(--lapis);
  --background-primary: var(--pastel);
  --background-secondary: var(--white);
  --text-tiny: 12px;
  --text-small: 14px;
  --text-medium: 16px;
  --text-large: 18px;
  --text-header: 24px;
  --border: var(--lapis);
  --border-radius: 4px;
}

body {
  margin: 0;
  background: var(--background-primary);
  color: var(--text-primary);
  font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', Helvetica, Arial, sans-serif;
  font-size: var(--text-medium);
}

h1 {
  font-size: var(--text-header);
}

h4 {
  margin: 0;
  font-weight: normal;
}

a {
  color: var(--text-secondary);
  text-decoration: none;
}

.app {
  display: flex;
}

.view {
  width: calc(100vw - 288px - 64px);
  margin: 0 32px;
}

.view.full {
  width: 100vw;
  margin: 0;
}

@media (max-width: 1024px) {
  .view {
    width: calc(100vw - 32px);
    margin: 64px 16px 0 16px;
  }
}

/* Reset */

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

#app {
  isolation: isolate;
}
</style>
