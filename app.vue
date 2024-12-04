<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale } = useI18n();

// Set HTML dir attribute
useHead({
  htmlAttrs: {
    dir: computed(() => locale.value === 'ar' ? 'rtl' : 'ltr'),
    lang: computed(() => locale.value),
  },
});
</script>
