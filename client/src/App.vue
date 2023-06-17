<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useMeetStore } from './stores/meet';
import socket from './socket';
import GlobalAlert from './components/GlobalAlert.vue';

const meet = useMeetStore();
const display = useDisplay();

const isDev = import.meta.env.DEV;

onMounted(() => {
  socket.connect();
});

onBeforeUnmount(() => {
  // terminate socket connection
  socket.disconnect();
  // remove date interval
  clearInterval(meet.dateInterval);
});
</script>

<template>
  <div v-if="isDev">{{ display.name }}</div>
  <VApp style="min-height: 100vh">
    <GlobalAlert />
    <RouterView v-slot="{ Component }">
      <XyzTransition xyz="fade" mode="out-in">
        <component :is="Component" />
      </XyzTransition>
    </RouterView>
  </VApp>
</template>
