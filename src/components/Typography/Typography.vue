<template>
  <div :class="CLASS_MAP[type]">
    <slot />
  </div>
</template>

<script setup lang="ts">
const CLASS_MAP = {
  title: 'font-semibold leading-6 text-gray-900',
  subtitle: 'text-sm leading-5 text-gray-500',
} as const;

withDefaults(
  defineProps<{
    type?: 'title' | 'subtitle';
  }>(),
  {
    type: 'title',
  },
);
</script>
