import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', () => {
  const name = useLocalStorage<string | null>('store/user/name', null);
  const email = useLocalStorage<string | null>('store/user/email', null);

  const validCredentials = computed(() => {
    return name.value && email.value ? true : false;
  });

  return { name, email, validCredentials };
});
