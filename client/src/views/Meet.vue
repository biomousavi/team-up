<script setup lang="ts">
import { onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useMeetStore } from '@/stores/meet';
import ErrorModal from '@/components/ErrorModal.vue';
import CredentialsModal from '@/components/CredentialsModal.vue';
import MeetScene from '@/components/MeetScene.vue';
import ChatBottomsheet from '@/components/ChatBottomsheet.vue';
import ChatSidebar from '@/components/ChatSidebar.vue';

const route = useRoute();
const user = useUserStore();
const meet = useMeetStore();
const { smAndDown } = useDisplay();

async function initMeeting() {
  const meetId = route.params.meetId as string;
  meet.setMeetId(meetId); // update meet Id

  // check user credentials
  if (user.hasValidCredentials) {
    await meet.initConnection();
  } else {
    meet.showCredentialModal();
  }
}

onMounted(initMeeting);
</script>

<template>
  <main class="d-flex flex-column justify-space-between">
    <ErrorModal />
    <CredentialsModal @save="initMeeting" />
    <div class="container overflow-hidden d-flex h-100 w-100" :class="{ 'chat-on': meet.chatOn }">
      <MeetScene />

      <ChatBottomsheet v-if="smAndDown" />
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
