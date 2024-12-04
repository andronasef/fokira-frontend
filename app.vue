<template>
  <div class="min-h-screen bg-gray-50" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <AppHeader />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Update HTML dir attribute when locale changes
watch(() => useI18n().locale.value, (newLocale) => {
  document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
});
</script>
