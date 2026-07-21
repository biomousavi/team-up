<script setup lang="ts">
import isUrl from 'is-url';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mdiVideoPlusOutline, mdiLink, mdiPlus } from '@mdi/js';
import socket from '@/socket';
import MeetInfoCard from './MeetInfoCard.vue';
import PatchBayAnimation from './PatchBayAnimation.vue';
import type { MeetEvent, NewMeetAck } from '@/types';

const router = useRouter();
const meetingCode = ref<string>('');
const isInputFocused = ref<boolean>(false);
const meetInfoModal = ref<boolean>(false);
const laterMeetingCode = ref<string>('');

async function onInstantMeet() {
  const { meetId } = await requestNewMeet();

  // navigate user to created meet
  router.push({ name: 'meet', params: { meetId } });
}

async function onLaterMeet() {
  const currentUrl = window.location.href;
  const { meetId } = await requestNewMeet();

  laterMeetingCode.value = currentUrl + meetId;
  meetInfoModal.value = true;
}

function requestNewMeet(): Promise<NewMeetAck> {
  return new Promise((resolve) => {
    const event: MeetEvent = 'new-meet';
    socket.emit(event, undefined, (ack: NewMeetAck) => resolve(ack));
  });
}

function onJoin() {
  if (isUrl(meetingCode.value)) {
    window.location.href = meetingCode.value;
  } else {
    router.push({ name: 'meet', params: { meetId: meetingCode.value } });
  }
}

const onUpdateFocuse = (isFocuesd: boolean) => (isInputFocused.value = isFocuesd);
</script>

<template>
  <v-dialog v-model="meetInfoModal">
    <MeetInfoCard v-model="meetInfoModal" :meet-code="laterMeetingCode" />
  </v-dialog>
  <XyzTransition appear duration="auto">
    <v-row class="h-100" justify="space-between">
      <v-col class="d-flex flex-column justify-center" cols="12" md="7" lg="5" xl="6">
        <div>
          <div xyz="big fade stagger">
            <h1 class="hero-heading xyz-nested font-weight-bold text-h5 text-sm-h4 text-xl-h2">
              Premium video meetings.
              <br />
              Now free <span class="bg-primary rounded-lg py-1 px-2">for everyone.</span>
            </h1>

            <p class="xyz-nested text-medium-emphasis text-body mt-6">
              We re-engineered the service that we built for secure business meetings
              <br />
              TeamUp, to make it free and available for all. Meet with your teammates.
            </p>
          </div>

          <v-row
            no-gutters
            align="start"
            justify="start"
            class="mt-7"
            xyz="duration delay-8 down fade stagger"
          >
            <v-col class="xyz-nested" cols="auto">
              <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    min-height="40px"
                    variant="flat"
                    color="primary"
                    :prepend-icon="mdiVideoPlusOutline"
                    class="font-weight-bold text-capitalize"
                  >
                    New Meeting
                  </v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item
                    @click="onLaterMeet"
                    :prepend-icon="mdiLink"
                    title="Create a meeting for later"
                  />
                  <v-list-item
                    @click="onInstantMeet"
                    :prepend-icon="mdiPlus"
                    title="Start an instant meeting"
                  />
                </v-list>
              </v-menu>
            </v-col>

            <v-col class="xyz-nested mx-0 mx-sm-3 my-3 my-sm-0" cols="9" sm="5" md="7" xl="5">
              <v-slide-x-transition class="d-flex align-start justify-space-between w-100" group tag="div">
                <v-text-field
                  class="join-input"
                  key="input"
                  @update:focused="onUpdateFocuse"
                  v-model="meetingCode"
                  color="primary"
                  density="compact"
                  variant="outlined"
                  placeholder="Enter a code or link"
                ></v-text-field>

                <v-btn
                  @click="onJoin"
                  key="join"
                  variant="text"
                  color="primary"
                  min-height="40px"
                  :disabled="meetingCode?.length < 8"
                  v-if="isInputFocused"
                  class="font-weight-bold text-capitalize"
                >
                  Join
                </v-btn>
              </v-slide-x-transition>
            </v-col>
          </v-row>

          <XyzTransition appear duration="auto" xyz="fade left-5 small-100% delay-15">
            <v-divider class="my-5"></v-divider>
          </XyzTransition>

          <p xyz="fade down delay-15">
            <a class="learn-more-link text-primary xyz-nested" href="#"> Learn more </a>
            <span class="text-medium-emphasis xyz-nested"> about TeamUp</span>
          </p>
        </div>
      </v-col>

      <v-col
        xyz="fade delay-20"
        class="d-flex flex-column align-center justify-center text-center"
        cols="12"
        md="5"
        lg="5"
      >
        <PatchBayAnimation />
        <p class="text-medium-emphasis mt-4" style="max-width: 320px">
          Direct, not routed. TeamUp connects you straight to the people you're calling — no server
          in between, so audio and video move as fast as your connection allows.
        </p>
      </v-col>
    </v-row>
  </XyzTransition>
</template>

<style scoped>
.hero-heading {
  line-height: 165%;
  font-family: 'Space Grotesk', 'Roboto', sans-serif;
}

.join-input {
  max-width: 85%;
}

.learn-more-link {
  text-decoration: none;
}
</style>
