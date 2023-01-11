<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useMeetStore } from '@/stores/meet';
import VideoStream from './VideoStream.vue';
import { useUserStore } from '@/stores/user';
import MeetNavigation from '@/components/MeetNavigation.vue';

const meet = useMeetStore();
const user = useUserStore();

const sceneColumns = computed(() => {
  const meetingUsers = meet.users.length;
  const root = Math.floor(Math.sqrt(meetingUsers));

  let column: number = 1;
  if (meetingUsers > 1) column = Math.ceil(meetingUsers / root);

  return `repeat(${column}, 1fr)`;
});
</script>

<template>
  <div class="scene">
    <!-- local stream -->
    <VideoStream v-if="meet.localStream" :data="{name:user.name!, stream:meet.localStream}" />

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
  grid-template-columns: v-bind(sceneColumns);
  transition-duration: 0.6s;
  transition-delay: 0.1s;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-on .scene {
  width: calc(100% - 400px);
}
</style>
