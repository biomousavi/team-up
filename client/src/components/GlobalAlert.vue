<script setup lang="ts">
import { useMeetStore } from '@/stores/meet';

const meet = useMeetStore();
</script>

<template>
  <v-alert
    style="z-index: 2400; display: block"
    position="absolute"
    v-if="meet.alertMessage"
    variant="flat"
    color="red"
    rounded="0"
  >
    <h4>{{ meet.alertMessage }}</h4>
  </v-alert>
</template>
