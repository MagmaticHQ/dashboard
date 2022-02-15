<template>
  <div>
    <div
      v-if="label"
      class="label"
    >
      {{ label }}
    </div>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      @input="update"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  setup(_props, { emit }) {
    function update(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      emit('update:modelValue', value);
    }

    return {
      update,
    };
  },
});
</script>

<style scoped>
.label {
  color: var(--text-secondary);
  font-size: var(--text-tiny);
  cursor: default;
}

input {
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  outline: none;
  background: var(--background-secondary);
  color: var(--text-secondary);
  -webkit-appearance: none;
  -moz-appearance: none;
}

input::placeholder {
  opacity: 0.5;
  color: var(--text-secondary);
}
</style>
