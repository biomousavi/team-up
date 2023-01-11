<script setup lang="ts">
import type { User } from '@/types';
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';

interface VideoStream {
  name: string;
  stream: MediaStream;
}

const props = defineProps<{ data: VideoStream }>();

const video = ref<HTMLVideoElement>();

onMounted(setStram);

function setStram() {
  video.value!.srcObject = props.data.stream;
  video.value!.muted = true;
  video.value!.autoplay = true;
  video.value!.playsInline = true;

  video.value!.onloadeddata = () => {
    video.value?.play();
  };
}
</script>

<template>
  <div class="video-wrapper bg-grey-darken-3">
    <video ref="video" class="w-100"></video>
  </div>
</template>

<style scoped>
.video-wrapper {
  border: 1px solid rgba(170, 170, 170, 0.2);
  overflow: hidden;
  height: 100%;
  border-radius: 10px;
  transition: all 0.3s ease;
}
.video-wrapper:hover {
  /* transform: scale(1.1); */
  /* position: fixed;
  margin: auto;
  width: 70vw; */
}

video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
