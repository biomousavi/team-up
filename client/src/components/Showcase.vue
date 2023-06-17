<script setup lang="ts">
import 'swiper/css';
import isUrl from 'is-url';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mdiVideoPlusOutline, mdiLink, mdiPlus, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import socket from '@/socket';
import MeetInfoCard from './MeetInfoCard.vue';
import type { MeetEvent, NewMeetAck } from '@/types';

const router = useRouter();
const meetingCode = ref<string>('');
const isInputFocused = ref<boolean>(false);
const meetInfoModal = ref<boolean>(false);
const laterMeetingCode = ref<string>('');

const slideIndex = ref<number>(0);

const slides = [
  {
    img: '/share-link.png',
    title: 'Get a link that you can share',
    desc: 'Click New meeting to get a link that you can send to people that you want to meet with',
  },
  {
    img: '/plan.png',
    title: 'Plan ahead',
    desc: 'Click New meeting to schedule meetings in Google Calendar and send invitations to participants',
  },
  {
    img: '/privacy.png',
    title: 'Your meeting is safe',
    desc: 'No one can join a meeting unless invited or admitted by the host',
  },
];

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

function onSlideNext() {
  if (slideIndex.value < slides.length - 1) {
    slideIndex.value++;
  }
}

function onSlidePrev() {
  if (slideIndex.value > 0) {
    slideIndex.value--;
  }
}
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
            <h1
              style="line-height: 165%"
              class="xyz-nested font-weight-bold text-h5 text-sm-h4 text-xl-h2 rubik"
            >
              Premium video meetings.
              <br />
              Now free <span class="bg-primary rounded-lg py-1 px-2">for everyone.</span>
            </h1>

            <p class="xyz-nested text-secondary text-body mt-6 rubik">
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
              <v-slide-x-transition
                class="d-flex align-start justify-space-between w-100"
                group
                tag="div"
              >
                <v-text-field
                  style="max-width: 85%"
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
            <a class="text-primary xyz-nested" style="text-decoration: none" href="#"> Learn more </a>
            <span class="text-secondary xyz-nested"> about TeamUp</span>
          </p>
        </div>
      </v-col>

      <v-col xyz="fade delay-20" class="d-flex align-center" cols="12" md="5" lg="5">
        <v-btn
          color="secondary"
          :disabled="slideIndex === 0"
          @click="onSlidePrev"
          :icon="mdiChevronLeft"
          variant="text"
        ></v-btn>
        <XyzTransition xyz="fade stagger delay-0" mode="out-in">
          <div class="d-flex flex-column text-center" :key="slideIndex">
            <VImg
              width="100%"
              height="auto"
              class="xyz-nested"
              key="0"
              :src="slides[slideIndex].img"
              :alt="slides[slideIndex].title"
            />
            <h3 class="xyz-nested" key="1">{{ slides[slideIndex].title }}</h3>
            <p class="xyz-nested" key="2">{{ slides[slideIndex].desc }}</p>
          </div>
        </XyzTransition>
        <v-btn
          color="secondary"
          @click="onSlideNext"
          :icon="mdiChevronRight"
          variant="text"
          :disabled="slideIndex === slides.length - 1"
        ></v-btn>
      </v-col>
    </v-row>
  </XyzTransition>
</template>
