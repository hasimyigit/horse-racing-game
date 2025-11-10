<template>
  <div
    class="racer-component"
    :style="{
      left: `${progress}%`,
    }"
  >
    <div class="racer-avatar" :style="{ backgroundColor: color }" :title="name">
      <span class="horse-emoji">𐂃</span>
    </div>
    <div class="speed-effect" :style="{ opacity: progress > 0 && progress < 100 ? 0.8 : 0 }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress: number
  color: string
  name: string
}

defineProps<Props>()
</script>

<style scoped>
.racer-component {
  @apply absolute top-1/2 -translate-y-1/2 transition-all duration-100 ease-linear z-10;
}

.racer-avatar {
  @apply w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl border-2 border-white relative z-20;
}

.horse-emoji {
  @apply filter drop-shadow-sm;
}

.speed-effect {
  @apply absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent rounded-full blur-sm z-10;
  animation: speedPulse 0.5s ease-in-out infinite;
}

@keyframes speedPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
}
</style>
