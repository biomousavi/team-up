<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMeetStore } from '@/stores/meet';
import ErrorModal from '@/components/ErrorModal.vue';
import CredentialsModal from '@/components/CredentialsModal.vue';
import MeetScene from '@/components/MeetScene.vue';
import ChatBottomsheet from '@/components/ChatBottomsheet.vue';
import ChatSidebar from '@/components/ChatSidebar.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const route = useRoute();
const user = useUserStore();
const meet = useMeetStore();
const display = useDisplay();

onMounted(initMeeting);

async function initMeeting() {
  // update meet Id
  meet.meetId = route.params.meetId as string;

  // check user credentials
  if (user.validCredentials) {
    await meet.initConnection();
  } else {
    meet.showCredentialModal();
  }
}

function onSaveCredentials() {
  initMeeting();
}
</script>

<template>
  <main class="d-flex flex-column justify-space-between">
    <ErrorModal />
    <CredentialsModal @save="onSaveCredentials" />
    <div class="container overflow-hidden d-flex h-100 w-100" :class="{ 'chat-on': meet.chatOn }">
      <MeetScene />

      <ChatBottomsheet v-if="display.smAndDown.value" />
      <ChatSidebar v-else />
    </div>
  </main>
</template>

<style scoped>
main {
  max-height: 100vh;
  min-height: 100vh;
  background-color: #202124;
}

.container {
  position: relative;
}
</style>
