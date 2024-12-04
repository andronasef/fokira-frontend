<template>
  <NuxtLink
    :to="`/profile/${author.id}`"
    class="inline-block"
  >
    <div
      :class="[
        'rounded-full overflow-hidden',
        size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-16 h-16',
      ]"
    >
      <img
        v-if="author.avatar"
        :src="author.avatar"
        :alt="author.name"
        class="w-full h-full object-cover"
      />
      <Avatar
        v-else
        :size="40"
        :name="author.name"
        :variant="variant || 'beam'"
        :colors="['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']"
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import Avatar from "vue-boring-avatars";
import type { Author } from '~/types/author';

defineProps<{
  author: Author;
  size?: "sm" | "md" | "lg";
  variant?: "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";
}>();
</script>
