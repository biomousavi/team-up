<script setup lang="ts">
const jacks = [
  { id: 'a1', x: 60, y: 60 },
  { id: 'a2', x: 160, y: 60 },
  { id: 'a3', x: 260, y: 60 },
  { id: 'a4', x: 360, y: 60 },
  { id: 'b1', x: 60, y: 180 },
  { id: 'b2', x: 160, y: 180 },
  { id: 'b3', x: 260, y: 180 },
  { id: 'b4', x: 360, y: 180 },
];

const activeIds = new Set(['a2', 'b3']);
</script>

<template>
  <svg
    class="patch-bay"
    viewBox="0 0 400 240"
    role="img"
    aria-label="Illustration of a patch cable connecting two jacks, representing a direct peer-to-peer connection"
  >
    <path class="cable" d="M 160 60 C 160 130, 260 110, 260 180" />
    <circle
      v-for="jack in jacks"
      :key="jack.id"
      :cx="jack.x"
      :cy="jack.y"
      r="10"
      class="jack"
      :class="{ 'jack--active': activeIds.has(jack.id) }"
    />
  </svg>
</template>

<style scoped>
.patch-bay {
  width: 100%;
  max-width: 360px;
  height: auto;
}

.jack {
  fill: none;
  stroke: rgb(var(--v-theme-on-surface));
  stroke-width: 2;
  opacity: 0.35;
  transform-box: fill-box;
  transform-origin: center;
}

.jack--active {
  opacity: 1;
  stroke: rgb(var(--v-theme-success));
  animation: jack-pulse 2.4s ease-in-out 1.4s infinite;
}

.cable {
  fill: none;
  stroke: rgb(var(--v-theme-secondary));
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  animation: cable-draw 1.2s ease-out 0.3s forwards;
}

@keyframes cable-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes jack-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.15);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cable {
    animation: none;
    stroke-dashoffset: 0;
  }
  .jack--active {
    animation: none;
  }
}
</style>
