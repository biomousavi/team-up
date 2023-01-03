<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useMeetStore } from './stores/meet';
import socket from './socket';

const d = useDisplay();

const meet = useMeetStore();
onMounted(() => {
  socket.connect();
});

onBeforeUnmount(() => {
  socket.disconnect();
  // remove date interval
  clearInterval(meet.dateInterval);
});
</script>

<template>
  {{ d.name }}
  <v-app style="min-height: 100vh">
    <v-alert v-if="!meet.connected" variant="flat" color="red" rounded="0">
      ERR_CONNECTION_REFUSED: We can't connect to server.
    </v-alert>
    <RouterView v-slot="{ Component }">
      <XyzTransition xyz="fade" mode="out-in">
        <component :is="Component" />
      </XyzTransition>
    </RouterView>
  </v-app>
</template>
