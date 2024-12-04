<template>
  <div :class="[size === 'sm' ? 'w-8 h-8' : 'w-10 h-10']">
    <Avatar
      :size="40"
      :name="name"
      :variant="variant ?? 'beam'"
      :colors="['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']"
    />
  </div>
</template>

<script setup lang="ts">
import Avatar from "vue-boring-avatars";

defineProps<{
  name: string;
  src?: string;
  size?: "sm" | "md";
  variant?: "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";
}>();

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = ""; // Clear src to show the fallback avatar
};
</script>
