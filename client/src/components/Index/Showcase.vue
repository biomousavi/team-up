<script setup lang="ts">
import '@splidejs/vue-splide/css/core';
import { ref, onMounted, onUnmounted } from 'vue';
import { mdiVideoPlusOutline, mdiLink, mdiPlus, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import { useRouter } from 'vue-router';

const splide = ref();
const meetingCode = ref<string>('');
const isInputFocused = ref<boolean>(false);
const slideNumber = ref<number>(0);

const router = useRouter();

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

function onSlideLeft() {
  if (slideNumber.value > 0) {
    slideNumber.value = slideNumber.value - 1;
    splide.value.go(slideNumber.value);
  }
}
function onSlideRight() {
  if (slideNumber.value < slides.length - 1) {
    slideNumber.value = slideNumber.value + 1;
    splide.value.go(slideNumber.value);
  }
}

function onInstantMeet() {
  console.log('instant');
}

function onLaterMeet() {
  console.log('later');
}

function onJoin() {
  router.push({ name: 'room', params: { roomId: meetingCode.value } });
}

function onUpdateFocuse(isFocuesd: boolean) {
  isInputFocused.value = isFocuesd;
}

function onSlideMove(_, newIndex: number) {
  slideNumber.value = newIndex;
}
</script>

<template>
  <XyzTransition appear duration="auto">
    <v-row class="h-100 mt-16" justify="space-between">
      <v-col class="d-flex flex-column justify-center" cols="12" md="7" lg="5">
        <div>
          <div xyz="left up fade stagger">
            <h1
              style="line-height: 125%"
              class="xyz-nested font-weight-bold text-h5 text-sm-h4 text-md-h4 text-xl-h2 rubik"
            >
              Premium video meetings.
              <br />
              Now free for everyone.
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
            <a class="text-primary xyz-nested" style="text-decoration: none" href="/about"
              >Learn more
            </a>
            <span class="text-secondary xyz-nested"> about TeamUp</span>
          </p>
        </div>
      </v-col>

      <v-col xyz="fade delay-20" class="d-flex align-center justify-center" cols="12" md="5" lg="5">
        <v-btn
          @click="onSlideLeft"
          :disabled="slideNumber === 0"
          color="secondary"
          :icon="mdiChevronLeft"
          variant="text"
          class="xyz-nested"
        ></v-btn>

        <Splide
          class="xyz-nested"
          @splide:move="onSlideMove"
          ref="splide"
          :options="{ rewind: true, arrows: false, width: '70%', autoplay: true }"
        >
          <template v-for="slide in slides" :key="slide.title">
            <SplideSlide>
              <img :src="slide.img" :alt="slide.title" />
              <h3>{{ slide.title }}</h3>
              <p>{{ slide.desc }}</p>
            </SplideSlide>
          </template>
        </Splide>

        <v-btn
          class="xyz-nested"
          color="secondary"
          @click="onSlideRight"
          :disabled="slideNumber > 1"
          :icon="mdiChevronRight"
          variant="text"
        ></v-btn>
      </v-col>
    </v-row>
  </XyzTransition>
</template>

<style scoped>
img {
  width: 100%;
  height: 100%;
}

.splide__slide {
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
