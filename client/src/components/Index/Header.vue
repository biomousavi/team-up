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
  <XyzTransition appear duration="auto">
    <header class="d-flex justify-space-between align-center">
      <div class="d-flex align-end" xyz="fade stagger ease-out-back">
        <img src="/team.png" alt="TeamUp-image" class="xyz-nested" />
        <router-link class="mx-1 text-secondary xyz-nested" to="/"> TeamUp </router-link>
      </div>

      <div
        xyz="duration stagger-5 fade up"
        class="d-flex flex-row-reverse justify-start align-center flex-wrap"
      >
        <v-btn
          @click="onSettings"
          :icon="mdiCogOutline"
          title="Settings"
          color="secondary"
          variant="text"
          class="xyz-nested"
        >
        </v-btn>

        <v-btn
          @click="onSettings"
          :icon="mdiHelpCircleOutline"
          title="Help"
          color="secondary"
          variant="text"
          class="xyz-nested"
        >
        </v-btn>

        <v-btn
          @click="onSettings"
          :icon="mdiMessageAlertOutline"
          title="Feedback"
          color="secondary"
          variant="text"
          class="xyz-nested"
        >
        </v-btn>

        <p class="text-secondary mx-2 xyz-nested">
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
  </XyzTransition>
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
