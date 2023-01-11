<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import { useMeetStore } from '@/stores/meet';
import VideoStream from './VideoStream.vue';
import { useUserStore } from '@/stores/user';
import MeetNavigation from '@/components/MeetNavigation.vue';

const meet = useMeetStore();
const user = useUserStore();

onUnmounted(meet.leaveRoom);

const sceneFraction = computed(() => {
  const meetingUsers = meet.users.length;
  let root = Math.floor(Math.sqrt(meetingUsers));

  if (meetingUsers % 2) {
    root = Math.ceil(Math.cbrt(meetingUsers));
  }

  let fraction: number = 1;
  if (meetingUsers > 1) fraction = Math.ceil(meetingUsers / root);

  return `repeat(${fraction}, 1fr)`;
});
</script>

<template>
  <div class="scene">
    <!-- local stream -->
    <VideoStream v-if="meet.localStream" :data="{name:user.name!, stream:meet.localStream!}" />

    <!-- remote streams -->
    <template v-for="user of meet.users" :key="user.id">
      <VideoStream v-if="user.mediaStream" :data="{name:user.name!, stream: user.mediaStream}" />
    </template>

    <MeetNavigation />
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  display: grid;
  gap: 5px;
  grid-template-columns: v-bind(sceneFraction);
  transition-duration: 0.6s;
  transition-delay: 0.1s;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-on .scene {
  width: calc(100% - 400px);
}
</style>
