<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onBeforeUnmount, onMounted } from 'vue';
import socket from './socket';
import { useMeetStore } from './stores/meet';
import GlobalAlert from './components/GlobalAlert.vue';

const meet = useMeetStore();

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
  <VApp>
    <GlobalAlert />
    <RouterView v-slot="{ Component }">
      <main class="h-100">
        <XyzTransition xyz="fade" mode="out-in">
          <component :is="Component" />
        </XyzTransition>
      </main>
    </RouterView>
  </VApp>
</template>
