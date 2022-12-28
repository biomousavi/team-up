<script setup lang="ts">
import '@splidejs/vue-splide/css/core';
import { ref, onMounted, onUnmounted } from 'vue';
import { mdiVideoPlusOutline, mdiLink, mdiPlus, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import { Splide, SplideSlide } from '@splidejs/vue-splide';

const isValidCode = ref(false);
const splide = ref();
const isInputFocused = ref<boolean>(false);
const slideNumber = ref<number>(0);

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
  console.log(slideNumber.value > 0);

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

function onUpdateFocuse(isFocuesd: boolean) {
  isInputFocused.value = isFocuesd;
}

function onSlideMove(_, newIndex: number) {
  slideNumber.value = newIndex;
}

function onInputupdate(input: string | undefined) {
  if (input && input.length > 8) isValidCode.value = true;
  else isValidCode.value = false;
}
</script>

<template>
  <v-row class="h-100 pt-16" justify="space-between">
    <v-col class="d-flex flex-column justify-center" cols="12" md="7" lg="5">
      <h1>
        Premium video meetings.
        <br />
        Now free for everyone.
      </h1>
      <p class="text-secondary mt-6">
        We re-engineered the service that we built for secure business meetings
        <br />
        TeamUp, to make it free and available for all.
        <br />
        Meet with your teammates.
      </p>

      <div class="d-flex align-start justify-space-between mt-6">
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

        <v-slide-x-transition class="d-flex align-start justify-space-between w-100" group tag="div">
          <v-text-field
            style="max-width: 85%"
            key="input"
            @update:focused="onUpdateFocuse"
            @update:model-value="onInputupdate"
            class="mx-2"
            color="primary"
            density="compact"
            variant="outlined"
            placeholder="Enter a code or link"
          ></v-text-field>

          <v-btn
            key="join"
            variant="text"
            color="primary"
            min-height="40px"
            :disabled="!isValidCode"
            v-if="isInputFocused"
            class="font-weight-bold text-capitalize"
          >
            Join
          </v-btn>
        </v-slide-x-transition>
      </div>

      <v-divider class="my-5"></v-divider>

      <p>
        <a class="text-primary" style="text-decoration: none" href="/about">Learn more </a>
        <span class="text-secondary"> about TeamUp</span>
      </p>
    </v-col>
    <v-col class="d-flex align-center justify-center py-0" cols="12" md="5" lg="5">
      <v-btn
        @click="onSlideLeft"
        :disabled="slideNumber === 0"
        color="secondary"
        :icon="mdiChevronLeft"
        variant="text"
      ></v-btn>
      <Splide
        @splide:move="onSlideMove"
        ref="splide"
        :options="{ rewind: true, arrows: false, width: '70%', autoplay: true }"
        aria-label="My Favorite Images"
      >
        <template v-for="(slide, index) in slides" :key="index">
          <SplideSlide>
            <img :src="slide.img" :alt="slide.title" />
            <h3>{{ slide.title }}</h3>
            <p>{{ slide.desc }}</p>
          </SplideSlide>
        </template>
      </Splide>
      <v-btn
        color="secondary"
        @click="onSlideRight"
        :disabled="slideNumber > 1"
        :icon="mdiChevronRight"
        variant="text"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
h1 {
  font-weight: 400;
  font-size: 40px;
}

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
