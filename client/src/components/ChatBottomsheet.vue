<script setup lang="ts">
import MeetChat from './ChatBox.vue';
</script>

<template>
  <div class="sheet">
    <MeetChat />
  </div>
</template>

<style scoped>
.sheet {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 4%;
  width: 90%;
  height: 80%;
  margin: 0 auto;
  transform: translateY(130%);
  transition-duration: 0.6s;
  transition-delay: 0.1s;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-on .sheet {
  transform: translateY(0);
}
</style>
