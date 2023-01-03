<script setup lang="ts">
import IndexHeader from '@/components/Header.vue';
import IndexShowcase from '@/components/Showcase.vue';
</script>

<template>
  <main class="h-100 bg-reds">
    <v-container class="h-100 d-flex flex-column">
      <IndexHeader />
      <IndexShowcase />
    </v-container>
  </main>
</template>
