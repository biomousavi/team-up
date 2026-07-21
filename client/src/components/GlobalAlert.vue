<script setup lang="ts">
import { useMeetStore } from '@/stores/meet';

const meet = useMeetStore();
</script>

<template>
  <v-alert
    class="global-alert"
    position="absolute"
    v-if="meet.alertMessage"
    variant="flat"
    color="error"
    rounded="0"
  >
    <h4>{{ meet.alertMessage }}</h4>
  </v-alert>
</template>

<style scoped>
.global-alert {
  z-index: 2400;
  display: block;
}
</style>
