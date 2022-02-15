<template>
  <div class="select">
    <div
      class="label"
      @click="showOptions"
    >
      {{ label }}
    </div>
    <div
      class="body"
      @click="showOptions"
    >
      {{ text }}
      <IconChevronUp
        v-if="shown"
        class="icon"
      />
      <IconChevronDown
        v-else
        class="icon"
      />
    </div>
    <div
      v-if="shown"
      class="options"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="option"
        @click="handleOptionClick(option)"
      >
        {{ option.text }}
      </div>
    </div>
    <div
      v-if="shown"
      class="backdrop"
      @click="handleBackdropClick"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed, ref } from 'vue';

import IconChevronDown from '@/components/icons/IconChevronDown.vue';
import IconChevronUp from '@/components/icons/IconChevronUp.vue';

export interface Option {
  value: string;
  text: string;
}

export default defineComponent({
  components: {
    IconChevronDown,
    IconChevronUp,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    options: {
      type: Array as PropType<Option[]>,
      required: true,
    },
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    function handleBackdropClick(): void {
      shown.value = false;
    }

    const text = computed(() => {
      const option = props.options.find(
        (option) => option.value === props.modelValue,
      );
      if (!option) {
        return '';
      }
      return option.text;
    });

    const shown = ref(false);

    function showOptions(): void {
      shown.value = true;
    }

    function handleOptionClick(option: Option): void {
      shown.value = false;
      emit('update:modelValue', option.value);
      emit('change', option.value);
    }

    return {
      handleBackdropClick,

      text,

      shown,
      showOptions,

      handleOptionClick,
    };
  },
});
</script>

<style scoped>
.label {
  color: var(--text-secondary);
  font-size: var(--text-tiny);
  cursor: pointer;
}

.body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 128px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  outline: none;
  background: var(--background-secondary);
  color: var(--text-secondary);
  cursor: pointer;
}

.select:hover > .label,
.select:hover > .body {
  border-color: var(--accent);
  color: var(--accent);
}

.icon {
  height: 16px;
}

.options {
  position: absolute;
  z-index: 1;
  margin-top: 8px;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background-secondary);
  color: var(--text-secondary);
}

.option {
  width: 128px;
  padding: 4px 8px;
  cursor: pointer;
}

.option:hover {
  border-radius: var(--border-radius);
  background: var(--background-primary);
}

.option-custom {
  margin-top: 8px;
}

.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
