<template>
  <li class="flex justify-between items-center gap-x-6 py-5 px-4 max-w-2xl">
    <div class="flex flex-col gap-1">
      <slot name="text" />
    </div>
    <div>
      <slot name="action" />
    </div>
  </li>
</template>
