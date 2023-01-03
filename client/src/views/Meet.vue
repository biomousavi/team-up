<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, onBeforeMount } from 'vue';
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
  mdiAccount,
  mdiCogBox,
  mdiEmail,
} from '@mdi/js';
import { useUserStore } from '@/stores/user';
import { useMeetStore } from '@/stores/meet';
import type { VTextField } from 'vuetify/components/VTextField';
import socket from '../socket';
import type { JoinPayload, JoinAck, MeetEvent } from '../types';
import type { Socket } from 'socket.io-client';

const route = useRoute();
const user = useUserStore();
const meet = useMeetStore();

const credentialsModal = ref<boolean>(false);
const nameInput = ref<VTextField>();
const emailInput = ref<VTextField>();

const inputMessage = ref<string | undefined>();

const chatOn = ref<boolean>(false);

const handRaised = ref<boolean>(false);
const handColor = ref<'white' | 'primary'>('white');

const micOn = ref<boolean>(true);
const micIcon = ref<string>(mdiMicrophone);
const micColor = ref<'white' | 'red'>('white');

const camOn = ref<boolean>(true);
const camIcon = ref<string>(mdiVideoOutline);
const camColor = ref<'white' | 'red'>('white');

onBeforeMount(initMeeting);

function initMeeting() {
  // check user credentials
  if (user.validCredentials) {
    joinToMeet(socket, {
      name: user.name!,
      email: user.email!,
      meetId: getMeetId(),
    });
  } else {
    toggleCredentialInput();
  }
}

function joinToMeet(sockets: Socket, payload: JoinPayload) {
  const event: MeetEvent = 'join';
  sockets.emit(event, payload, handleJoinAck);

  function handleJoinAck(ack: JoinAck) {
    console.log(ack);
  }
}

function toggleCredentialInput() {
  credentialsModal.value = !credentialsModal.value;
}

const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Invalid e-mail.';
  },
};

async function onSaveInput() {
  // validate inputs
  const nameErrors = await nameInput.value?.validate();
  const emailErrors = await emailInput.value?.validate();

  // check error length if exists
  if (!nameErrors?.length && !emailErrors?.length) {
    toggleCredentialInput();
    initMeeting();
  }
}

const getMeetId = () => route.params.meetId as string;

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
    <v-dialog persistent v-model="credentialsModal">
      <v-row no-gutters justify="center" align="center">
        <v-col cols="11" sm="6" md="4" lg="3" xl="2">
          <v-card class="rounded-lg">
            <v-card-title class="text-center font-weight-bold"> Name & Email </v-card-title>

            <v-card-text>
              <div class="my-2 text-subtitle-2 font-weight-bold">Name</div>
              <v-text-field
                ref="nameInput"
                placeholder="Enter your name"
                density="compact"
                variant="outlined"
                :rules="[rules.required]"
                v-model="user.name"
                :prepend-inner-icon="mdiAccount"
              ></v-text-field>

              <div class="my-2 text-subtitle-2 font-weight-bold">Email</div>
              <v-text-field
                ref="emailInput"
                placeholder="Enter your email"
                :rules="[rules.required, rules.email]"
                density="compact"
                variant="outlined"
                v-model="user.email"
                :prepend-inner-icon="mdiEmail"
              ></v-text-field>
            </v-card-text>

            <v-card-actions class="d-flex justify-end">
              <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold"
                @click="onSaveInput"
                rounded="lg"
              >
                save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>

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
          {{ meet.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
        </span>
        <span class="mx-2 text-secondary">|</span>
        <span> {{ getMeetId() }} </span>
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
