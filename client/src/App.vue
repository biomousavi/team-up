<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { RouterView } from 'vue-router';
import { onBeforeUnmount, onMounted } from 'vue';
import socket from './socket';
import { useMeetStore } from './stores/meet';
import GlobalAlert from './components/GlobalAlert.vue';

const meet = useMeetStore();
const { name } = useDisplay();

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
  <!-- show display breakpoint name for debugging -->
  <div v-if="isDev">{{ name }}</div>
  <VApp>
    <GlobalAlert />
    <RouterView v-slot="{ Component }">
      <XyzTransition xyz="fade" mode="out-in">
        <main class="h-100"><component :is="Component" /></main>
      </XyzTransition>
    </RouterView>
  </VApp>
</template>
