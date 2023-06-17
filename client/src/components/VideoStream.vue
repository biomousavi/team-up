<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  stream: { type: MediaStream, required: true },
  mute: { required: false, default: false, type: Boolean },
});

const video = ref<HTMLVideoElement>();

function setStram() {
  video.value!.srcObject = props.stream;
  video.value!.autoplay = true;
  video.value!.playsInline = true;

  video.value!.onloadeddata = () => {
    video.value?.play();
  };
}

onMounted(setStram);
</script>

<template>
  <div class="video-wrapper bg-grey-darken-3">
    <video :muted="props.mute" ref="video" class="w-100"></video>
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
