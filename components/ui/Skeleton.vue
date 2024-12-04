<template>
  <div
    :class="[
      'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md',
      circle ? 'rounded-full' : '',
    ]"
    :style="{
      width: width,
      height: height,
    }"
  />
</template>

<script setup lang="ts">
defineProps<{
  width: string;
  height: string;
  circle?: boolean;
}>();
</script>
