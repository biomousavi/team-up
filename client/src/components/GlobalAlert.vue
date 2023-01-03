<script setup lang="ts">
import { useMeetStore } from '@/stores/meet';

const meet = useMeetStore();
</script>

<template>
  <v-alert v-if="meet.alertMessage" variant="flat" color="red" rounded="0">
    {{ meet.alertMessage }}
  </v-alert>
</template>
