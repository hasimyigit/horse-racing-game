<template>
  <button :class="buttonClasses" :disabled="disabled" @click="$emit('click')">
    <span class="button-icon">
      <slot name="icon">⚡</slot>
    </span>
    <span class="button-text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  size: 'md',
})

defineEmits<{
  click: []
}>()

const variantClasses = {
  primary: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-600',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600',
  neutral: 'bg-slate-600 hover:bg-slate-500 text-slate-100 border-slate-500',
} as const

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
} as const

const buttonClasses = [
  'inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 border shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
]
</script>
