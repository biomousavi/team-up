import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useMeetStore = defineStore('meet', () => {
  const date = ref<Date>(new Date());
  // update Date object every minute
  const dateInterval = setInterval(() => (date.value = new Date()), 60000);

  const alertMessage = ref<string | null>();

  return { date, dateInterval, alertMessage };
});
