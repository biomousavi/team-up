<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  mdiMicrophone,
  mdiPhoneHangup,
  mdiMicrophoneOff,
  mdiVideoOutline,
  mdiVideoOffOutline,
  mdiMonitorScreenshot,
  mdiInformationOutline,
  mdiMessageTextOutline,
  mdiRecordCircleOutline,
} from '@mdi/js';
import { useMeetStore } from '@/stores/meet';
import MeetInfoCard from './MeetInfoCard.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const meet = useMeetStore();
const display = useDisplay();

const meetInfoModal = ref<boolean>(false);
const meetingCode = ref<string>('');

const screenIconColor = ref<'white' | 'primary'>('white');

const micIcon = ref<string>(mdiMicrophone);
const micColor = ref<'white' | 'red'>('white');

const recordIconColor = ref<'white' | 'red'>('white');

const camIcon = ref<string>(mdiVideoOutline);
const camColor = ref<'white' | 'red'>('white');

async function toggleScreenRecord() {
  await meet.toggleScreenRecording();
  recordIconColor.value = meet.screenRecordOn === true ? 'red' : 'white';
}

function onToggleCam() {
  meet.toggleCamera();

  camIcon.value = meet.camOn ? mdiVideoOutline : mdiVideoOffOutline;
  camColor.value = camColor.value === 'red' ? 'white' : 'red';
}

function onToggleMic() {
  meet.toggleMicrophone();
  micIcon.value = meet.micOn ? mdiMicrophone : mdiMicrophoneOff;
  micColor.value = micColor.value === 'red' ? 'white' : 'red';
}

function onToggleInfo() {
  const currentUrl = window.location.href;

  meetingCode.value = currentUrl;
  meetInfoModal.value = true;
}

function onToggleChat() {
  meet.chatOn = !meet.chatOn;
}
</script>

<template>
  <div
    v-if="meet.showNavigation"
    class="navigation d-flex flex-column-reverse flex-md-row flex-wrap justify-space-between align-center ma-3"
  >
    <v-dialog v-model="meetInfoModal">
      <MeetInfoCard v-model="meetInfoModal" :meet-code="meetingCode" />
    </v-dialog>

    <!-- left section -->
    <div class="text-white d-flex justify-space-between">
      <span>
        {{ meet.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
      </span>
      <span class="mx-2 text-secondary">|</span>
      <span> {{ meet.meetId }} </span>
    </div>

    <!-- center section -->
    <div class="d-flex justify-space-evenly my-4 align-center">
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

      <v-tooltip v-if="!display.mobile.value" location="top center" text="Share Screen">
        <template v-slot:activator="{ props }">
          <v-btn
            size="small"
            class="mx-2"
            @click="meet.toggleScreenSHaring"
            :color="meet.screenShareOn ? 'primary' : 'white'"
            :icon="mdiMonitorScreenshot"
            v-bind="props"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip location="top center" text="Leave Call">
        <template v-slot:activator="{ props }">
          <div class="leave-call-icon mx-2">
            <v-btn color="red" to="/" @click="meet.leaveRoom" rounded="pill" block v-bind="props">
              <v-icon size="x-large" :icon="mdiPhoneHangup"></v-icon>
            </v-btn>
          </div>
        </template>
      </v-tooltip>

      <v-tooltip v-if="!display.mobile.value" location="top center" text="Record">
        <template v-slot:activator="{ props }">
          <v-btn
            @click="toggleScreenRecord"
            :color="recordIconColor"
            size="small"
            class="mx-2"
            :icon="mdiRecordCircleOutline"
            v-bind="props"
          />
        </template>
      </v-tooltip>
    </div>

    <!-- right section -->
    <div class="d-flex justify-space-between">
      <v-tooltip location="top center" text="Details">
        <template v-slot:activator="{ props }">
          <v-btn
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
            variant="text"
            :color="meet.chatOn ? 'blue' : 'white'"
            v-bind="props"
            @click="onToggleChat"
            :icon="mdiMessageTextOutline"
          ></v-btn>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<style scoped>
.leave-call-icon {
  width: 80px;
}

@media only screen and (max-width: 960px) {
  .navigation > div {
    width: 100%;
  }
}

.navigation {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>
