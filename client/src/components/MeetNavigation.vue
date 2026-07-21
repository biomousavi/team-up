<script setup lang="ts">
import {
  mdiPhoneHangup,
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiVideoOutline,
  mdiVideoOffOutline,
  mdiMonitorScreenshot,
  mdiInformationOutline,
  mdiMessageTextOutline,
  mdiRecordCircleOutline,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js';
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useMeetStore } from '@/stores/meet';
import { useThemeToggle } from '@/composables/useThemeToggle';
import MeetInfoCard from './MeetInfoCard.vue';

const meet = useMeetStore();
const display = useDisplay();
const { toggleTheme, isDark } = useThemeToggle();

const meetInfoModal = ref<boolean>(false);
const meetingCode = ref<string>('');

const recordIconColor = ref<'on-surface' | 'error'>('on-surface');

const micIcon = computed(() => (meet.micOn ? mdiMicrophone : mdiMicrophoneOff));
const camIcon = computed(() => (meet.camOn ? mdiVideoOutline : mdiVideoOffOutline));

async function toggleScreenRecord() {
  await meet.toggleScreenRecording();
  recordIconColor.value = meet.screenRecordOn ? 'error' : 'on-surface';
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
    <div class="readout d-flex justify-space-between text-on-surface font-mono">
      <span>
        {{ meet.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
      </span>
      <span class="mx-2 text-medium-emphasis">|</span>
      <span> {{ meet.meetId }} </span>
    </div>

    <!-- center section -->
    <div class="d-flex justify-space-between my-4 align-center">
      <v-tooltip location="top center" text="Toggle Microphone">
        <template v-slot:activator="{ props }">
          <v-btn
            size="small"
            class="mx-2 jack-btn"
            @click="meet.toggleMicrophone"
            :color="meet.micOn ? 'success' : 'error'"
            :icon="micIcon"
            v-bind="props"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip location="top center" text="Toggle Camera">
        <template v-slot:activator="{ props }">
          <v-btn
            size="small"
            class="mx-2 jack-btn"
            @click="meet.toggleCamera"
            :color="meet.camOn ? 'success' : 'error'"
            :icon="camIcon"
            v-bind="props"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-if="!display.mobile.value" location="top center" text="Share Screen">
        <template v-slot:activator="{ props }">
          <v-btn
            size="small"
            class="mx-2 jack-btn"
            @click="meet.toggleScreenSHaring"
            :color="meet.screenShareOn ? 'primary' : 'on-surface'"
            :icon="mdiMonitorScreenshot"
            v-bind="props"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip location="top center" text="Leave Call">
        <template v-slot:activator="{ props }">
          <div class="leave-call-icon mx-2">
            <v-btn color="error" to="/" @click="meet.leaveRoom" rounded="pill" block v-bind="props">
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
            class="mx-2 jack-btn"
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
            color="on-surface"
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
            :color="meet.chatOn ? 'primary' : 'on-surface'"
            v-bind="props"
            @click="onToggleChat"
            :icon="mdiMessageTextOutline"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="isDark() ? 'Switch to light theme' : 'Switch to dark theme'" location="top center">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            color="on-surface"
            v-bind="props"
            @click="toggleTheme"
            :icon="isDark() ? mdiWeatherSunny : mdiWeatherNight"
          ></v-btn>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/tokens' as tokens;

.leave-call-icon {
  width: 80px;
}

.jack-btn:hover,
.jack-btn:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--v-theme-secondary));
}

@media only screen and (max-width: #{tokens.$mobile-breakpoint}) {
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
