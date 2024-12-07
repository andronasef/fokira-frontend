<template>
  <NuxtLink
    :to="enableLink ? `/profile/${author.id}` : ''"
    class="inline-block"
  >
    <Avatar
      :size="size || 32"
      :name="author.name"
      :variant="variant || 'beam'"
      :colors="['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import Avatar from "vue-boring-avatars";
import type { Author } from "~/types/author";

const props = withDefaults(
  defineProps<{
    author: Author;
    size?: number;
    variant?: "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";
    enableLink?: boolean;
  }>(),
  {
    size: 32,
    variant: "beam",
    enableLink: true,
  }
);
</script>
