<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import {
  mdiSend,
  mdiMicrophone,
  mdiPhoneHangup,
  mdiMicrophoneOff,
  mdiVideoOutline,
  mdiVideoOffOutline,
  mdiHandBackRightOutline,
  mdiDotsVertical,
  mdiInformationOutline,
  mdiMessageTextOutline,
  mdiWindowClose,
} from '@mdi/js';

const route = useRoute();
const date = ref<Date>(new Date());

const inputMessage = ref<string | undefined>();

const chatOn = ref<boolean>(true);

const handRaised = ref<boolean>(false);
const handColor = ref<'white' | 'primary'>('white');

const micOn = ref<boolean>(true);
const micIcon = ref<string>(mdiMicrophone);
const micColor = ref<'white' | 'red'>('white');

const camOn = ref<boolean>(true);
const camIcon = ref<string>(mdiVideoOutline);
const camColor = ref<'white' | 'red'>('white');

let interval;
onUnmounted(() => clearInterval(interval));
onMounted(() => {
  interval = setInterval(() => (date.value = new Date()), 60000);
});

const getRoomId = () => route.params.roomId as string;

function onToggleHand() {
  handRaised.value = !handRaised.value;
  handColor.value = handColor.value === 'white' ? 'primary' : 'white';
}

function onToggleCam() {
  camOn.value = !camOn.value;
  camIcon.value = camOn.value ? mdiVideoOutline : mdiVideoOffOutline;
  camColor.value = camColor.value === 'red' ? 'white' : 'red';
}

function onToggleMic() {
  micOn.value = !micOn.value;
  micIcon.value = micOn.value ? mdiMicrophone : mdiMicrophoneOff;
  micColor.value = micColor.value === 'red' ? 'white' : 'red';
}

function onToggleInfo() {}

function onToggleChat() {
  chatOn.value = !chatOn.value;
}
</script>

<template>
  <main class="d-flex flex-column justify-space-between">
    <div class="d-flex h-100" style="position: relative" :class="{ 'chat-on': chatOn }">
      <div class="scene">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero esse eveniet saepe voluptate
        aut ipsum voluptas cum labore quia molestias cumque eius, explicabo facilis delectus, quaerat,
        neque id? Quo porro temporibus explicabo facilis nemo inventore culpa itaque laborum, rem
        consequatur. Quibusdam, dolorum eum nemo illo debitis ipsa officiis expedita ullam.
      </div>

      <div class="chat pa-2 h-100">
        <div class="d-flex rounded-lg bg-white w-100 pa-2">
          <div class="d-flex justify-space-between align-center w-100">
            <h2 class="text-body-1 rubik">In-call message</h2>

            <v-tooltip location="left center" text="Close chat">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="mx-2"
                  variant="text"
                  v-bind="props"
                  @click="onToggleChat"
                  :icon="mdiWindowClose"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </div>
        <div
          class="messages d-flex flex-column justify-space-between rounded-lg bg-white w-100 pa-2 mt-2"
        >
          <p class="d-inline bg-grey-lighten-3 text-grey-darken-2 pa-2 rounded-lg">
            Messages can be seen only by people in the call and are deleted when the call ends
          </p>

          <div class="d-flex justify-space-between align-center bg-grey-lighten-3 rounded-pill">
            <!-- <input type="text" />

            <v-text-field
              :append-inner-icon="mdiSend"
              variant="plain"
              density="compact"
              class="rounded-pill bg-grey-lighten-3 px-4 pb-3"
              hide-details
              placeholder="Send a message to everyone"
            ></v-text-field> -->

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
      </div>
    </div>

    <div class="d-flex justify-space-between align-center ma-3">
      <!-- left section -->
      <div class="text-white">
        <span>
          {{ date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
        </span>
        <span class="mx-2 text-secondary">|</span>
        <span> {{ getRoomId() }} </span>
      </div>

      <!-- center section -->
      <div class="d-flex align-center">
        <v-tooltip location="top center" text="Toggle Microphone">
          <template v-slot:activator="{ props }">
            <v-btn
              size="small"
              class="mx-2"
              @click="onToggleMic"
              :color="micColor"
              :icon="micIcon"
              v-bind="props"
            ></v-btn>
          </template>
        </v-tooltip>

        <v-tooltip location="top center" text="Toggle Camera">
          <template v-slot:activator="{ props }">
            <v-btn
              size="small"
              class="mx-2"
              @click="onToggleCam"
              :color="camColor"
              :icon="camIcon"
              v-bind="props"
            ></v-btn>
          </template>
        </v-tooltip>

        <v-tooltip location="top center" text="Raise Hand">
          <template v-slot:activator="{ props }">
            <v-btn
              size="small"
              class="mx-2"
              @click="onToggleHand"
              :color="handColor"
              :icon="mdiHandBackRightOutline"
              v-bind="props"
            ></v-btn>
          </template>
        </v-tooltip>

        <v-tooltip location="top center" text="Leave Call">
          <template v-slot:activator="{ props }">
            <div class="leave-call-icon mx-2">
              <v-btn color="red" rounded="pill" block v-bind="props">
                <v-icon size="x-large" :icon="mdiPhoneHangup"></v-icon>
              </v-btn>
            </div>
          </template>
        </v-tooltip>

        <v-tooltip location="top center" text="More Options">
          <template v-slot:activator="{ props }">
            <v-btn size="small" class="mx-2" :icon="mdiDotsVertical" v-bind="props" />
          </template>
        </v-tooltip>
      </div>

      <!-- right section -->
      <div>
        <v-tooltip location="top center" text="Details">
          <template v-slot:activator="{ props }">
            <v-btn
              class="mx-2"
              variant="text"
              color="white"
              v-bind="props"
              @click="onToggleInfo"
              :icon="mdiInformationOutline"
            ></v-btn>
          </template>
        </v-tooltip>

        <v-tooltip location="top center" text="Chat">
          <template v-slot:activator="{ props }">
            <v-btn
              class="mx-2"
              variant="text"
              :color="chatOn ? 'blue' : 'white'"
              v-bind="props"
              @click="onToggleChat"
              :icon="mdiMessageTextOutline"
            ></v-btn>
          </template>
        </v-tooltip>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background-color: #202124;
}
.leave-call-icon {
  width: 80px;
}

.chat,
.scene {
  transition-duration: 0.6s;
  transition-delay: 0.1s;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.scene {
  width: 100%;
}

.chat-on .scene {
  width: calc(100% - 400px);
}

.chat {
  width: 400px;
  position: absolute;
  top: 0;
  right: -50%;
  opacity: 0;
}

.chat-on .chat {
  right: 0;
  opacity: 1;
}

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
