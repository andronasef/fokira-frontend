<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <div class="flex items-center mb-4">
      <!-- Avatar Skeleton -->
      <Skeleton width="2.5rem" height="2.5rem" circle />
      
      <div class="mr-3 flex-grow">
        <!-- Author Name Skeleton -->
        <Skeleton width="8rem" height="1rem" class="mb-1" />
        <!-- Date Skeleton -->
        <Skeleton width="6rem" height="0.75rem" />
      </div>
    </div>

    <!-- Title Skeleton -->
    <Skeleton width="90%" height="1.5rem" class="mb-4" />

    <!-- Content Skeleton -->
    <div class="space-y-2">
      <Skeleton width="100%" height="1rem" />
      <Skeleton width="85%" height="1rem" />
      <Skeleton width="70%" height="1rem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from './ui/Skeleton.vue';
</script>
