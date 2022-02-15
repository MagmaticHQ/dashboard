<template>
  <div class="select">
    <div
      class="label"
      @click="showOptions"
    >
      Period
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
      <div>
        <div
          v-for="option in options"
          :key="option.text"
          class="option"
          @click="handleOptionClick(option)"
        >
          {{ option.text }}
        </div>
      </div>
      <div>
        <div
          class="option option-custom"
        >
          <div @click="handleCustomClick()">
            Custom
          </div>
          <div>
            <Input
              v-model="customPeriod.from"
              class="input"
              :label="'From'"
              :type="'date'"
              :placeholder="'16/03/2020'"
            />
            <Input
              v-model="customPeriod.to"
              class="input"
              :label="'To'"
              :type="'date'"
              :placeholder="'15/03/2021'"
            />
          </div>
        </div>
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
import { PropType, defineComponent, computed, ref, reactive } from 'vue';

import Input from '@/components/Input.vue';
import IconChevronDown from '@/components/icons/IconChevronDown.vue';
import IconChevronUp from '@/components/icons/IconChevronUp.vue';
import { Period, getPeriod } from '@/utils/dates';

interface Option {
  value: Period;
  text: string;
}

const options: Option[] = [
  { value: getPeriod(30), text: '30 days' },
  { value: getPeriod(90), text: '90 days' },
  { value: getPeriod(180), text: '180 days' },
  { value: getPeriod(365), text: '365 days' },
];

export default defineComponent({
  components: {
    IconChevronDown,
    IconChevronUp,
    Input,
  },
  props: {
    modelValue: {
      type: Object as PropType<Period>,
      default: '',
    },
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    function handleBackdropClick(): void {
      shown.value = false;
    }

    const text = computed(() => {
      const options: Intl.DateTimeFormatOptions = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      };
      const fromDate = new Date(props.modelValue.from);
      const fromString = fromDate.toLocaleDateString('en-GB', options);
      const toDate = new Date(props.modelValue.to);
      const toString = toDate.toLocaleDateString('en-GB', options);
      return `${fromString}–${toString}`;
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

    function handleCustomClick(): void {
      if (!customPeriod.from || !customPeriod.to) {
        return;
      }
      shown.value = false;
      emit('update:modelValue', customPeriod);
      emit('change', customPeriod);
    }

    const customPeriod = reactive<Period>({
      from: '2021-01-01',
      to: '2021-02-01',
    });

    return {
      handleBackdropClick,

      text,

      shown,
      showOptions,
      options,

      customPeriod,

      handleOptionClick,
      handleCustomClick,
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
  width: 176px;
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
  width: 176px;
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
