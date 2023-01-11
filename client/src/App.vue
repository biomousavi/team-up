<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useMeetStore } from './stores/meet';
import socket from './socket';
import GlobalAlert from './components/GlobalAlert.vue';

const display = useDisplay();

const meet = useMeetStore();

onMounted(() => socket.connect());

onBeforeUnmount(() => {
  // terminate socket connection
  socket.disconnect();
  // remove date interval
  clearInterval(meet.dateInterval);
});
</script>

<template>
  <!-- <div>{{ display.name }}</div> -->
  <v-app style="min-height: 100vh">
    <GlobalAlert />
    <RouterView v-slot="{ Component }">
      <XyzTransition xyz="fade" mode="out-in">
        <component :is="Component" />
      </XyzTransition>
    </RouterView>
  </v-app>
</template>
