<template>
  <div
    class="competitor-card"
    :class="{
      'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20': isSelected,
      'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30': !isSelected,
    }"
  >
    <div class="color-indicator" :style="{ backgroundColor: competitor.color }" />

    <div class="competitor-info">
      <h3 class="name">{{ competitor.name }}</h3>
      <p class="id">ID: {{ competitor.id }}</p>
    </div>

    <div class="condition-section">
      <div
        class="condition-badge"
        :class="{
          'bg-emerald-500/20 text-emerald-400': competitor.condition >= 80,
          'bg-amber-500/20 text-amber-400': competitor.condition >= 50 && competitor.condition < 80,
          'bg-rose-500/20 text-rose-400': competitor.condition < 50,
        }"
      >
        {{ competitor.condition }}
      </div>
      <div class="condition-label">Condition</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Horse } from '@/types'

interface Props {
  competitor: Horse
  isSelected?: boolean
}

withDefaults(defineProps<Props>(), {
  isSelected: false,
})
</script>

<style scoped>
.competitor-card {
  @apply flex items-center gap-4 p-4 rounded-xl border transition-all duration-200;
}

.color-indicator {
  @apply w-10 h-10 rounded-full border-2 border-slate-600 flex-shrink-0;
}

.competitor-info {
  @apply flex-1 min-w-0;
}

.name {
  @apply font-bold text-slate-100 truncate text-lg;
}

.id {
  @apply text-xs text-slate-400;
}

.condition-section {
  @apply flex-shrink-0 flex flex-col items-center gap-1;
}

.condition-badge {
  @apply px-3 py-1 rounded-full text-xs font-bold;
}

.condition-label {
  @apply text-xs text-slate-500;
}
</style>
