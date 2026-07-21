<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { mdiCogOutline, mdiWeatherNight, mdiWeatherSunny } from '@mdi/js';
import { useMeetStore } from '@/stores/meet';
import { useThemeToggle } from '@/composables/useThemeToggle';
import CredentialsModal from './CredentialsModal.vue';

const meet = useMeetStore();
const { smAndDown } = useDisplay();
const { toggleTheme, isDark } = useThemeToggle();
</script>

<template>
  <XyzTransition appear duration="auto">
    <header class="d-flex justify-space-between align-start mb-12 mb-md-0">
      <div class="d-flex align-end" xyz="fade stagger ease-out">
        <img src="/team.png" alt="TeamUp-image" class="xyz-nested" />
        <router-link class="mx-1 text-on-surface xyz-nested" to="/"> TeamUp </router-link>
      </div>

      <CredentialsModal />

      <div
        xyz="duration stagger-5 fade up"
        class="d-flex flex-row-reverse justify-start align-center flex-wrap mt-2 mt-md-0"
      >
        <v-btn
          @click="meet.showCredentialModal()"
          :icon="mdiCogOutline"
          title="Settings"
          color="on-surface"
          variant="text"
          :size="smAndDown ? 'small' : 'large'"
          class="xyz-nested"
        >
        </v-btn>

        <v-btn
          @click="toggleTheme"
          :icon="isDark() ? mdiWeatherSunny : mdiWeatherNight"
          :title="isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
          color="on-surface"
          variant="text"
          :size="smAndDown ? 'small' : 'large'"
          class="xyz-nested"
        >
        </v-btn>

        <p class="date-readout text-medium-emphasis text-caption text-md-body-1 mx-2 xyz-nested font-mono">
          {{
            meet.date.toLocaleTimeString([], {
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
