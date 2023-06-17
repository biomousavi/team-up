<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { mdiSend, mdiWindowClose } from '@mdi/js';
import { useMeetStore } from '@/stores/meet';
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';

BScroll.use(MouseWheel);
const meet = useMeetStore();
const scroll = ref<BScroll>();
const wrapper = ref<HTMLDivElement>();
const inputMessage = ref<string | undefined>();

onMounted(() => {
  scroll.value = new BScroll(wrapper.value!, {
    specifiedIndexAsContent: 1,
    mouseWheel: { speed: 20, invert: false, easeTime: 300 },
    probeType: 3,
  });
});

watch(
  () => meet.messages,
  () => {
    scroll.value?.scrollTo(0, -(scroll.value.scrollerHeight + 50), 300);
    scroll.value?.refresh();
  },
  { deep: true, immediate: true },
);

function onToggleChat() {
  meet.chatOn = !meet.chatOn;
}

function sendMessage() {
  meet.sendMessage(inputMessage.value!);
  inputMessage.value = undefined;
}
</script>

<template>
  <div class="d-flex rounded-lg bg-white w-100 pa-2">
    <div class="d-flex justify-space-between align-center w-100">
      <h2 class="text-body-1 rubik">In-call message</h2>

      <v-btn class="mx-2" variant="text" @click="onToggleChat" :icon="mdiWindowClose"></v-btn>
    </div>
  </div>

  <div
    class="messages d-flex flex-column justify-space-between rounded-lg bg-white w-100 pa-2 pb-4 mt-2"
  >
    <!-- Message List -->
    <div ref="wrapper" class="h-100 overflow-y-auto">
      <!-- Message Header -->
      <p class="d-block bg-grey-lighten-3 text-grey-darken-2 pa-2 rounded-lg">
        Messages can be seen only by people in the call and are deleted when the call ends
      </p>

      <ul class="message-list bg-white pb-8">
        <XyzTransitionGroup xyz="fade down appear-stagger">
          <li
            class="message pa-2 ma-1 d-flex algin-center"
            v-for="(message, index) of meet.messages"
            :key="index"
          >
            <div class="rounded-pill d-flex justify-center bg-red">
              <h6 class="align-self-center text-uppercase">{{ message.user.name?.charAt(0) }}</h6>
            </div>
            <div style="max-width: 14px; min-width: 14px" />
            <div class="d-flex flex-column">
              <h6>{{ message.user.name }}</h6>
              <p class="bg-grey-lighten-2 rounded-lg pa-2">{{ message.text }}</p>
            </div>
          </li>

          <li key="gap" style="height: 70px; width: 100%"></li>
        </XyzTransitionGroup>
      </ul>
    </div>

    <!-- Message Input -->
    <div class="d-flex justify-space-between align-center bg-grey-lighten-3 rounded-pill">
      <textarea
        @keyup.enter="sendMessage"
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
        @click="sendMessage"
        :icon="mdiSend"
      ></v-btn>
    </div>
  </div>
</template>

<style scoped>
.messages {
  height: calc(100% - 62px);
}
.message div:first-child {
  min-width: 30px;
  width: 30px;
  height: 30px;
  max-height: 30px;
}

.message h6 {
  font-size: 14px;
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
