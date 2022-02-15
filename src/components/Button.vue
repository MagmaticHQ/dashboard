<template>
  <button>
    {{ title }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
});
</script>

<style scoped>
button {
  width: 128px;
  height: 48px;
  border: none;
  border-radius: var(--border-radius);
  background: var(--accent);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  color: white;
  font-size: var(--text-large);
  text-transform: uppercase;
  cursor: pointer;
}

button:hover {
  transform: translateY(-0.125em);
  transition: 0.25s;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.25);
}
</style>
