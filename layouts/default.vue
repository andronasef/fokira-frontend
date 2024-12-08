<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { locale } = useI18n();
const router = useRouter();

const isUserMenuOpen = ref(false);

// Close menu when clicking outside
onClickOutside(isUserMenuOpen, () => {
  isUserMenuOpen.value = false;
});

const switchLanguage = () => {
  const newLocale = locale.value === "ar" ? "en" : "ar";
  locale.value = newLocale;
  document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
};

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

<style>
body {
  font-family: "Noto Sans Arabic", sans-serif;
}
</style>
