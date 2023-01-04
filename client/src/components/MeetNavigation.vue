<script setup lang="ts">
import { ref } from 'vue';
import {
  mdiMicrophone,
  mdiPhoneHangup,
  mdiMicrophoneOff,
  mdiVideoOutline,
  mdiVideoOffOutline,
  mdiHandBackRightOutline,
  mdiDotsVertical,
  mdiInformationOutline,
  mdiMessageTextOutline,
} from '@mdi/js';
import { useMeetStore } from '@/stores/meet';

const meet = useMeetStore();

const handRaised = ref<boolean>(false);
const handColor = ref<'white' | 'primary'>('white');

const micOn = ref<boolean>(true);
const micIcon = ref<string>(mdiMicrophone);
const micColor = ref<'white' | 'red'>('white');

const camOn = ref<boolean>(true);
const camIcon = ref<string>(mdiVideoOutline);
const camColor = ref<'white' | 'red'>('white');

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
  meet.chatOn = !meet.chatOn;
}
</script>

<template>
  <div class="d-flex justify-space-between align-center ma-3">
    <!-- left section -->
    <div class="text-white">
      <span>
        {{ meet.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
      </span>
      <span class="mx-2 text-secondary">|</span>
      <span> {{ meet.meetId }} </span>
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
</style>