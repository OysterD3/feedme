<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2 py-1 font-medium ring-1 ring-inset capitalize',
      COLORS[status],
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { QUEUE_STATUS } from '../../composables/useQueue';
import { BOT_STATUS } from '../../models/Bot';

const AVAILABLE_STATUS = {
  ...QUEUE_STATUS,
  ...BOT_STATUS,
} as const;

defineProps<{
  status: (typeof AVAILABLE_STATUS)[keyof typeof AVAILABLE_STATUS];
}>();

const COLORS = {
  [AVAILABLE_STATUS.processing]:
    'bg-orange-50 text-orange-600 ring-orange-600/20',
  [AVAILABLE_STATUS.pending]: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  [AVAILABLE_STATUS.busy]: 'bg-red-50 text-red-700 ring-red-600/10',
  [AVAILABLE_STATUS.idle]: 'bg-green-50 text-green-700 ring-green-600/20',
};
</script>
