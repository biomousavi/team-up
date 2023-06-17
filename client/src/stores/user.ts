import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', () => {
  const id = ref<string | null>(null);
  const name = useLocalStorage<string | null>('store/user/name', null);
  const email = useLocalStorage<string | null>('store/user/email', null);

  const hasValidCredentials = computed(() => (name.value && email.value ? true : false));

  return { id, name, email, hasValidCredentials };
});
