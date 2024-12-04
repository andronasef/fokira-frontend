<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto">
      <div class="flex justify-between items-center px-4 py-3">
        <!-- Logo and Navigation -->
        <div class="flex items-center space-x-8 space-x-reverse">
          <NuxtLink
            to="/"
            class="text-2xl font-bold text-primary-600"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{ opacity: 1, x: 0 }"
          >
            فكرة
          </NuxtLink>

          <div class="hidden md:flex items-center space-x-4 space-x-reverse">
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-green-600"
              :class="{ 'text-green-600': $route.path === '/' }"
              v-motion
              :initial="{ opacity: 0, y: -10 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="100"
            >
              {{ t("nav.home") }}
            </NuxtLink>
            <NuxtLink
              to="/posts/my-posts"
              class="text-gray-700 hover:text-green-600"
              :class="{ 'text-green-600': $route.path === '/posts/my-posts' }"
              v-if="authStore.isAuthenticated"
              v-motion
              :initial="{ opacity: 0, y: -10 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="200"
            >
              {{ t("nav.my-posts") }}
            </NuxtLink>
          </div>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- <LanguageSwitcher /> -->

          <!-- Loading State -->
          <template v-if="authStore.loading">
            <div class="flex items-center space-x-2 space-x-reverse">
              <Skeleton width="5rem" height="2.5rem" />
              <Skeleton width="2rem" height="2rem" circle />
            </div>
          </template>

          <!-- Authenticated State -->
          <template v-else-if="authStore.isAuthenticated">
            <NuxtLink
              to="/posts/create"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
              v-motion
              :initial="{ opacity: 0, scale: 0.95 }"
              :enter="{ opacity: 1, scale: 1 }"
              :delay="300"
            >
              {{ t("nav.new-post") }}
            </NuxtLink>

            <div class="relative">
              <button
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center space-x-2 space-x-reverse"
                v-motion
                :initial="{ opacity: 0 }"
                :enter="{ opacity: 1 }"
                :delay="400"
              >
                <UiAvatar :author="authStore.user" size="sm" />
                <span class="text-gray-700">{{ authStore.user.name }}</span>
              </button>

              <div
                v-if="isProfileOpen"
                v-motion
                :initial="{ opacity: 0, y: 10 }"
                :enter="{ opacity: 1, y: 0 }"
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              >
                <div class="py-1">
                  <button
                    @click="logout"
                    class="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {{ t("nav.logout") }}
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Not Authenticated State -->
          <template v-else>
            <button
              @click="login"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
              v-motion
              :initial="{ opacity: 0, scale: 0.95 }"
              :enter="{ opacity: 1, scale: 1 }"
              :delay="300"
            >
              {{ t("nav.login") }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import Skeleton from "./ui/Skeleton.vue";
import UiAvatar from "./ui/Avatar.vue";

const { t } = useI18n();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const isProfileOpen = ref(false);

const login = () => {
  window.location.href = `${config.public.apiBase}/auth/google`;
};

const logout = () => {
  authStore.logout();
  navigateTo("/");
};

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = "/default-avatar.png";
};

onClickOutside(isProfileOpen, () => {
  isProfileOpen.value = false;
});
</script>
