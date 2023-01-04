<script setup lang="ts">
import { useMeetStore } from '@/stores/meet';

const meet = useMeetStore();
</script>

<template>
  <v-dialog v-model="meet.errorModal" persistent>
    <v-card color="error" class="rounded-lg align-self-center" min-width="300px" max-width="70%">
      <v-card-text>
        <p class="text-h6">{{ meet.errorMessage }}</p>
      </v-card-text>

      <v-card-actions class="pt-0 d-flex justify-end">
        <v-btn to="/" @click="meet.hideError" variant="outlined" class="font-weight-bold">
          Back to Home
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
