<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import { useMeetStore } from '@/stores/meet';
import VideoStream from './VideoStream.vue';
import { useUserStore } from '@/stores/user';
import MeetNavigation from '@/components/MeetNavigation.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const meet = useMeetStore();
const user = useUserStore();
const display = useDisplay();

onUnmounted(meet.leaveRoom);

const sceneFraction = computed(() => {
  const meetingUsers = meet.users.length;
  let root = Math.floor(Math.sqrt(meetingUsers));

  if (meetingUsers % 2) {
    root = Math.ceil(Math.cbrt(meetingUsers));
  }

  let fraction: number = 1;
  // only we had more than one user
  if (meetingUsers > 1) fraction = Math.ceil(meetingUsers / root);

  return `repeat(${fraction}, 1fr)`;
});

const sceneLayout = computed(() => {
  let gridTemplate: any = { 'grid-template-columns': sceneFraction.value };

  // if we had only two users, apply row direction
  if (display.smAndDown.value && meet.users.length === 2) {
    gridTemplate = { 'grid-template-rows': sceneFraction.value };
  }

  return gridTemplate;
});
</script>

<template>
  <XyzTransitionGroup
    :style="sceneLayout"
    appear
    class="scene"
    xyz="fade small out-down out-rotate-right appear-stagger"
  >
    <!-- local stream -->
    <VideoStream
      key="local-stream"
      v-if="meet.localStream"
      :data="{name:user.name!, stream:meet.localStream!}"
    />

    <!-- remote streams -->
    <template v-for="user of meet.users" :key="user.id">
      <VideoStream
        :key="user.id"
        v-if="user.mediaStream"
        :data="{name:user.name!, stream: user.mediaStream}"
      />
    </template>

    <MeetNavigation key="chat" />
  </XyzTransitionGroup>
</template>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  display: grid;
  gap: 5px;
  transition-duration: 0.6s;
  transition-delay: 0.1s;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-on .scene {
  width: calc(100% - 400px);
}
</style>
