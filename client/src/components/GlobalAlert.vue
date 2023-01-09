<script setup lang="ts">
import { useMeetStore } from '@/stores/meet';

const meet = useMeetStore();
</script>

<template>
  <div v-if="meet.alertMessage">
    <v-alert variant="flat" color="red" rounded="0">
      <pre class="rubik">{{ meet.alertMessage }}</pre>
    </v-alert>
  </div>
</template>
