<script setup lang="ts">
import IndexHeader from '@/components/Header.vue';
import IndexShowcase from '@/components/Showcase.vue';
</script>

<template>
  <VContainer class="h-100 d-flex flex-column">
    <VRow justify="center">
      <VCol cols="12" xl="10">
        <IndexHeader />
        <IndexShowcase />
      </VCol>
    </VRow>
  </VContainer>
</template>
