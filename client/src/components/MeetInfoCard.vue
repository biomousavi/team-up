<script setup lang="ts">
import { mdiClose, mdiContentCopy } from '@mdi/js';

defineEmits(['update:modelValue']);
const props = defineProps({
  meetCode: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

function onClickCopy(): void {
  navigator.clipboard.writeText(props.meetCode);
}
</script>

<template>
  <v-card class="rounded-lg align-self-center" max-width="320px">
    <v-card-title class="d-flex align-center justify-space-between">
      <p class="text-body-1 font-weight-bold">Here's the link to your meeting</p>
      <v-btn
        :icon="mdiClose"
        color="black"
        variant="text"
        class="font-weight-bold"
        @click="$emit('update:modelValue', false)"
      >
      </v-btn>
    </v-card-title>

    <v-card-text class="pt-0">
      <p style="font-size: 8px">
        Copy this link and send it to people that you want to meet with. Make sure that you save it so
        that you can use it later, too.
      </p>

      <div class="bg-grey-lighten-3 d-flex align-center justify-space-between px-2 my-3 rounded-lg">
        <span class="link text-caption"> {{ meetCode }} </span>
        <v-tooltip open-on-click :open-on-hover="false" location="right center">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="onClickCopy"
              title="Copy"
              variant="plain"
              size="small"
              :icon="mdiContentCopy"
            >
            </v-btn>
          </template>

          Copied meeting link
        </v-tooltip>
      </div>
    </v-card-text>
  </v-card>
</template>
