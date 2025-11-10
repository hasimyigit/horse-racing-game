<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="welcome-icon">🏳️</div>
      <h1 class="welcome-title">Welcome to VeliEfendi</h1>
      <p class="welcome-description">
        Create thrilling racing events and watch competitors battle for victory in this high-speed
        arena.
      </p>
      <ActionButton variant="primary" size="lg" @click="$emit('generate-schedule')">
        <template #icon>🎯</template>
        Create Your First Event
      </ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionButton from './ActionButton.vue'

defineEmits<{
  'generate-schedule': []
}>()
</script>

<style scoped>
.welcome-screen {
  @apply flex items-center justify-center min-h-[70vh] px-6;
}

.welcome-content {
  @apply text-center max-w-2xl;
}

.welcome-icon {
  @apply text-8xl mb-6 animate-bounce;
}

.welcome-title {
  @apply text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4;
}

.welcome-description {
  @apply text-xl text-slate-300 mb-8 leading-relaxed;
}
</style>
