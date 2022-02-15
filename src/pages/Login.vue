<template>
  <div class="page">
    <router-link :to="{ name: 'home' }">
      <h1>
        <span class="brand">Magmatic</span>
      </h1>
    </router-link>
    <div class="form">
      <Input
        v-model="email"
        class="input"
        :label="'Email'"
        :type="'email'"
        :placeholder="'john@doe.com'"
      />
      <Input
        v-model="password"
        class="input"
        :label="'Password'"
        :type="'password'"
        :placeholder="'hunter2'"
      />
    </div>
    <div class="button">
      <Button
        :title="'Enter'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';

export default defineComponent({
  components: {
    Button,
    Input,
  },

  setup() {
    const email = ref('');
    const password = ref('');

    return {
      email,
      password,
    };
  },
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.brand {
  color: var(--accent);
}

.form {
  margin-top: 8px;
}

.input {
  width: 192px;
  margin-top: 8px;
}

.button {
  margin-top: 32px;
}
</style>
