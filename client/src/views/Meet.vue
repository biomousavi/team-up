<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMeetStore } from '@/stores/meet';
import socket from '../socket';
import type { JoinPayload, JoinAck, MeetEvent } from '../types';
import ErrorModal from '@/components/ErrorModal.vue';
import CredentialsModal from '@/components/CredentialsModal.vue';
import MeetNavigation from '@/components/MeetNavigation.vue';
import MeetChat from '@/components/MeetChat.vue';
import MeetScene from '@/components/MeetScene.vue';

const route = useRoute();
const user = useUserStore();
const meet = useMeetStore();

onMounted(initMeeting);

function initMeeting() {
  // update meet Id
  meet.meetId = route.params.meetId as string;

  // check user credentials
  if (user.validCredentials) {
    joinToMeet();
  } else {
    meet.showCredentialModal();
  }
}

function joinToMeet() {
  const payload: JoinPayload = {
    name: user.name!,
    email: user.email!,
    meetId: meet.meetId!,
  };

  socket.emit<MeetEvent>('join', payload, handleJoinAck);
}

function handleJoinAck(ack: JoinAck) {
  if (ack.status === 'error') {
    meet.showError(ack.message!);
  } else {
    meet.addUser({ id: socket.id, name: user.name!, email: user.email! });
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
    <div class="container d-flex h-100" :class="{ 'chat-on': meet.chatOn }">
      <p class="text-white">{{ meet.users }}</p>
      <MeetScene />
      <MeetChat />
    </div>
    <MeetNavigation />
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background-color: #202124;
}

.container {
  position: relative;
}
</style>
