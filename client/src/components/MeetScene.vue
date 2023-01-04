<script setup lang="ts"></script>

<template>
  <div class="scene">
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero esse eveniet saepe voluptate aut
    ipsum voluptas cum labore quia molestias cumque eius, explicabo facilis delectus, quaerat, neque id?
    Quo porro temporibus explicabo facilis nemo inventore culpa itaque laborum, rem consequatur.
    Quibusdam, dolorum eum nemo illo debitis ipsa officiis expedita ullam.
  </div>
</template>

<style scoped>
.scene {
  transition-duration: 0.6s;
  transition-delay: 0.1s;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.scene {
  width: 100%;
}

.chat-on .scene {
  width: calc(100% - 400px);
}
</style>
