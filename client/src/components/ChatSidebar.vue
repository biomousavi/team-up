<script setup lang="ts">
import MeetChat from './ChatBox.vue';
</script>

<template>
  <div class="chat pa-2 h-100">
    <MeetChat />
  </div>
</template>

<style scoped lang="scss">
@use '../assets/tokens' as tokens;

.chat {
  transition-duration: 0.6s;
  transition-delay: 0.1s;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-on {
  width: calc(100% - #{tokens.$chat-panel-width});
}

.chat {
  width: #{tokens.$chat-panel-width};
  position: absolute;
  top: 0;
  right: -50%;
  opacity: 0;
}

.chat-on .chat {
  right: 0;
  opacity: 1;
}
</style>
