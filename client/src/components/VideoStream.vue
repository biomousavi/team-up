<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  stream: { type: MediaStream, required: true },
  mute: { required: false, default: false, type: Boolean },
  isLocal: { required: false, default: false, type: Boolean },
  micOn: { required: false, default: true, type: Boolean },
});

const video = ref<HTMLVideoElement>();

function setStream() {
  video.value!.srcObject = props.stream;
  video.value!.autoplay = true;
  video.value!.playsInline = true;

  video.value!.onloadeddata = () => {
    video.value?.play();
  };
}

onMounted(setStream);
watch(() => props.stream, setStream);
</script>

<template>
  <div class="video-wrapper bg-surface-variant" :class="{ 'video-wrapper--live': isLocal && micOn }">
    <video :muted="props.mute" ref="video" class="w-100"></video>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/tokens' as tokens;

.video-wrapper {
  border: 1px solid tokens.$tile-border-color;
  overflow: hidden;
  height: 100%;
  border-radius: tokens.$radius-md;
  transition: all 0.3s ease;
}

.video-wrapper--live {
  border-color: rgb(var(--v-theme-secondary));
  box-shadow: 0 0 0 2px rgb(var(--v-theme-secondary));
}

video {
  object-fit: cover;
  width: 100%;
  height: 100%;

  /* Mirror the video */
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
</style>
