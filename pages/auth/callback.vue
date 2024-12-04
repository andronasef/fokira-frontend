<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">{{ $t('auth.processingLogin') }}</h1>
      <div v-if="error" class="text-red-500">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const error = ref<string | null>(null);

onMounted(async () => {
  const { token } = route.query;
  
  if (!token || typeof token !== 'string') {
    error.value = 'Invalid token';
    setTimeout(() => router.push('/'), 2000);
    return;
  }

  try {
    // Set the token in the store
    authStore.setToken(token);
    
    // Fetch user data
    await authStore.checkAuth();
    
    // Redirect to home page
    router.push('/');
  } catch (err) {
    console.error('Login callback error:', err);
    error.value = 'Failed to process login';
    setTimeout(() => router.push('/'), 2000);
  }
});
</script>
