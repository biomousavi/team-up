<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMeetStore } from '@/stores/meet';
import { mdiAccount, mdiEmail } from '@mdi/js';
import type { VTextField } from 'vuetify/components/VTextField';

const user = useUserStore();
const meet = useMeetStore();

const emit = defineEmits(['save']);
const nameInput = ref<VTextField>();
const emailInput = ref<VTextField>();

async function onSave() {
  // validate inputs
  const nameErrors = await nameInput.value?.validate();
  const emailErrors = await emailInput.value?.validate();

  // check error length if exists
  if (!nameErrors?.length && !emailErrors?.length) {
    emit('save');
    meet.hideCredentialModal();
  }
}

const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Invalid e-mail.';
  },
};
</script>

<template>
  <v-dialog persistent v-model="meet.credentialsModal" max-width="350px">
    <v-card class="rounded-lg">
      <v-card-title class="text-center font-weight-bold"> Name & Email </v-card-title>
      <v-card-text>
        <div class="my-2 text-subtitle-2 font-weight-bold">Name</div>
        <v-text-field
          ref="nameInput"
          placeholder="Enter your name"
          density="compact"
          variant="outlined"
          :rules="[rules.required]"
          v-model="user.name"
          :prepend-inner-icon="mdiAccount"
        ></v-text-field>

        <div class="my-2 text-subtitle-2 font-weight-bold">Email</div>
        <v-text-field
          ref="emailInput"
          placeholder="Enter your email"
          :rules="[rules.required, rules.email]"
          density="compact"
          variant="outlined"
          v-model="user.email"
          :prepend-inner-icon="mdiEmail"
        ></v-text-field>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="black" variant="tonal" class="font-weight-bold" @click="onSave" rounded="lg">
          save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
