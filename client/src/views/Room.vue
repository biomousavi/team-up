<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import {
  mdiMicrophone,
  mdiPhoneHangup,
  mdiMicrophoneOff,
  mdiVideoOutline,
  mdiVideoOffOutline,
  mdiHandBackRightOutline,
} from '@mdi/js';

const route = useRoute();
const date = ref<Date>(new Date());

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
  camIcon.value = camOn.value ? mdiVideoOffOutline : mdiVideoOutline;
  camColor.value = camColor.value === 'red' ? 'white' : 'red';
}

function onToggleMic() {
  micOn.value = !micOn.value;
  micIcon.value = micOn.value ? mdiMicrophoneOff : mdiMicrophone;
  micColor.value = micColor.value === 'red' ? 'white' : 'red';
}
</script>

<template>
  <main class="d-flex flex-column justify-space-between">
    <div>scene</div>
    <div class="d-flex justify-space-between align-center ma-3">
      <div class="text-white">
        <span>
          {{ date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
        </span>
        <span class="mx-2 text-secondary">|</span>
        <span> {{ getRoomId() }} </span>
      </div>
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
            <div class="leave-call-icon">
              <v-btn color="red" class="mx-2" rounded="pill" block v-bind="props">
                <v-icon size="x-large" :icon="mdiPhoneHangup"></v-icon>
              </v-btn>
            </div>
          </template>
        </v-tooltip>
      </div>
      <div></div>
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
</style>
