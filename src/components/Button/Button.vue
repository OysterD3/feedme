<template>
  <button
    type="button"
    class="rounded-md bg-teal-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>
