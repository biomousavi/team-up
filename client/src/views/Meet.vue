<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMeetStore } from '@/stores/meet';
import ErrorModal from '@/components/ErrorModal.vue';
import CredentialsModal from '@/components/CredentialsModal.vue';
import MeetChat from '@/components/MeetChat.vue';
import MeetScene from '@/components/MeetScene.vue';

const route = useRoute();
const user = useUserStore();
const meet = useMeetStore();

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
  meet.hideCredentialModal();
  initMeeting();
}
</script>

<template>
  <main class="d-flex flex-column justify-space-between">
    <ErrorModal />
    <CredentialsModal @save="onSaveCredentials" />
    <div class="container d-flex" :class="{ 'chat-on': meet.chatOn }">
      <MeetScene />
      <MeetChat />
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
  height: 100%;
}
</style>
