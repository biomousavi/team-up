<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { mdiCogOutline, mdiMessageAlertOutline, mdiHelpCircleOutline } from '@mdi/js';
const date = ref<Date>(new Date());

let interval;
onMounted(() => {
  interval = setInterval(() => (date.value = new Date()), 60000);
});
onUnmounted(() => clearInterval(interval));

function onSettings() {
  console.log('aaaaaa');
}
</script>

<template>
  <header class="d-flex justify-space-between align-center">
    <div class="d-flex align-end">
      <img src="/team.png" alt="TeamUp-image" />
      <router-link class="mx-1 text-secondary" to="/"> TeamUp </router-link>
    </div>

    <div class="d-flex flex-row-reverse justify-start align-center flex-wrap">
      <v-btn
        @click="onSettings"
        :icon="mdiCogOutline"
        title="Settings"
        color="secondary"
        variant="text"
      >
      </v-btn>

      <v-btn
        @click="onSettings"
        :icon="mdiHelpCircleOutline"
        title="Help"
        color="secondary"
        variant="text"
      >
      </v-btn>

      <v-btn
        @click="onSettings"
        :icon="mdiMessageAlertOutline"
        title="Feedback"
        color="secondary"
        variant="text"
      >
      </v-btn>

      <p class="text-secondary mx-2">
        {{
          date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'short',
            year: 'numeric',
            day: 'numeric',
          })
        }}
      </p>
    </div>
  </header>
</template>

<style scoped>
img {
  width: 40px;
  height: 40px;
}

a {
  font-weight: bold;
  font-size: 20px;
  text-decoration: none;
}
</style>
