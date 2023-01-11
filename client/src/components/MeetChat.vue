<script setup lang="ts">
import { ref } from 'vue';
import { mdiSend, mdiWindowClose } from '@mdi/js';
import { useMeetStore } from '@/stores/meet';

const meet = useMeetStore();

const inputMessage = ref<string | undefined>();

function onToggleChat() {
  meet.chatOn = !meet.chatOn;
}
</script>

<template>
  <div class="d-flex rounded-lg bg-white w-100 pa-2">
    <div class="d-flex justify-space-between align-center w-100">
      <h2 class="text-body-1 rubik">In-call message</h2>

      <v-btn class="mx-2" variant="text" @click="onToggleChat" :icon="mdiWindowClose"></v-btn>
    </div>
  </div>
  <div class="messages d-flex flex-column justify-space-between rounded-lg bg-white w-100 pa-2 mt-2">
    <p class="d-inline bg-grey-lighten-3 text-grey-darken-2 pa-2 rounded-lg">
      Messages can be seen only by people in the call and are deleted when the call ends
    </p>

    <div class="d-flex justify-space-between align-center bg-grey-lighten-3 rounded-pill">
      <textarea
        v-model="inputMessage"
        rows="1"
        contenteditable
        class="msg-input px-3 py-1"
        id="bfTqV"
        aria-label="Send a message to everyone"
        placeholder="Send a message to everyone"
        maxlength="500"
      ></textarea>

      <v-btn
        class="ml-2"
        size="small"
        :disabled="!inputMessage?.length"
        variant="text"
        @click="onToggleChat"
        :icon="mdiSend"
      ></v-btn>
    </div>
  </div>
</template>

<style scoped>
.messages {
  height: calc(100% - 62px);
}

.msg-input {
  text-size-adjust: 100%;
  direction: ltr;
  width: 100%;
  min-width: 0;
  background: none;
  appearance: none;
  display: flex;
  border: none !important;
  background-color: transparent;
  flex-grow: 1;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  resize: none;
  line-height: 1.5rem;
  caret-color: rgb(32, 33, 36);
}

.msg-input:focus {
  outline: none;
}
</style>
