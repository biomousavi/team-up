<script setup lang="ts">
import IndexHeader from '@/components/Header.vue';
import IndexShowcase from '@/components/Showcase.vue';
</script>

<template>
  <VContainer class="d-flex flex-column h-100">
    <VRow justify="center">
      <VCol cols="12" xl="10" class="d-flex flex-column">
        <IndexHeader />
        <IndexShowcase />
      </VCol>
    </VRow>
  </VContainer>
</template>
