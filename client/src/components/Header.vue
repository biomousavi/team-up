<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { mdiCogOutline, mdiHelpCircleOutline, mdiMessageAlertOutline } from '@mdi/js';
import { useMeetStore } from '@/stores/meet';
import CredentialsModal from './CredentialsModal.vue';

const meet = useMeetStore();
const { smAndDown } = useDisplay();
</script>

<template>
  <XyzTransition appear duration="auto">
    <header class="d-flex justify-space-between align-start mb-12 mb-md-0">
      <div class="d-flex align-end" xyz="fade stagger ease-out">
        <img src="/team.png" alt="TeamUp-image" class="xyz-nested" />
        <router-link class="mx-1 text-secondary xyz-nested" to="/"> TeamUp </router-link>
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
          color="secondary"
          variant="text"
          :size="smAndDown ? 'small' : 'large'"
          class="xyz-nested"
        >
        </v-btn>

        <v-btn
          :icon="mdiHelpCircleOutline"
          title="Help"
          color="secondary"
          variant="text"
          class="xyz-nested"
        >
        </v-btn>

        <v-btn
          :icon="mdiMessageAlertOutline"
          title="Feedback"
          color="secondary"
          variant="text"
          class="xyz-nested"
        >
        </v-btn>

        <p class="text-secondary text-caption text-md-body-1 mx-2 xyz-nested rubik">
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
