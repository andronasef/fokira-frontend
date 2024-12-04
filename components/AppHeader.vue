<template>
  <header class="bg-white shadow">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo and Navigation -->
        <div class="flex items-center space-x-6 space-x-reverse">
          <NuxtLink to="/" class="text-2xl font-bold text-green-600">
            فكرة
          </NuxtLink>
          
          <div class="hidden md:flex items-center space-x-4 space-x-reverse">
            <NuxtLink 
              to="/" 
              class="text-gray-700 hover:text-green-600"
              :class="{ 'text-green-600': $route.path === '/' }"
            >
              {{ $t('nav.home') }}
            </NuxtLink>
            <NuxtLink 
              to="/my-posts" 
              class="text-gray-700 hover:text-green-600"
              :class="{ 'text-green-600': $route.path === '/my-posts' }"
              v-if="authStore.isAuthenticated"
            >
              {{ $t('nav.myPosts') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <LanguageSwitcher />
          
          <template v-if="authStore.isAuthenticated">
            <NuxtLink 
              to="/posts/create"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
            >
              {{ $t('nav.newPost') }}
            </NuxtLink>
            
            <div class="relative">
              <button
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center space-x-2 space-x-reverse"
              >
                <img 
                  :src="authStore.user?.avatar || '/default-avatar.png'" 
                  :alt="authStore.user?.name"
                  class="w-8 h-8 rounded-full"
                >
                <span class="text-gray-700">{{ authStore.user?.name }}</span>
              </button>

              <div 
                v-if="isProfileOpen"
                class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              >
                <div class="py-1">
                  <button
                    @click="logout"
                    class="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {{ $t('nav.logout') }}
                  </button>
                </div>
              </div>
            </div>
          </template>

          <button 
            v-else
            @click="login"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
          >
            {{ $t('nav.login') }}
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const config = useRuntimeConfig();
const isProfileOpen = ref(false);

const login = () => {
  window.location.href = `${config.public.apiBase}/auth/google`;
};

const logout = () => {
  authStore.logout();
  navigateTo('/');
};

onClickOutside(isProfileOpen, () => {
  isProfileOpen.value = false;
});
</script>
