<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useDisplay } from 'vuetify';
const d = useDisplay();
</script>

<template>
  {{ d.name }}
  <v-app>
    <RouterView v-slot="{ Component }">
      <XyzTransition xyz="fade" mode="out-in">
        <component :is="Component" />
      </XyzTransition>
    </RouterView>
  </v-app>
</template>
