<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useDisplay } from 'vuetify';
const d = useDisplay();
</script>

<template>
  {{ d.name }}
  <v-app>
    <RouterView />
  </v-app>
</template>
