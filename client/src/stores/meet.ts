import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useMeetStore = defineStore('meet', () => {
  const date = ref<Date>(new Date());
  // update Date object every minute
  const dateInterval = setInterval(() => (date.value = new Date()), 60000);

  // to avoid showing connection error alert before start connecting
  // we will update the state when we get connection error event
  const connected = ref<boolean>(true);

  return { date, dateInterval, connected };
});
