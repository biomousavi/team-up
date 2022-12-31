<script setup lang="ts">
import IndexHeader from '@/components/Index/Header.vue';
import IndexShowcase from '@/components/Index/Showcase.vue';
</script>

<template>
  <main style="min-height: 90vh" class="overflow-hidden">
    <v-container class="h-100">
      <IndexHeader />
      <IndexShowcase />
    </v-container>
  </main>
</template>
