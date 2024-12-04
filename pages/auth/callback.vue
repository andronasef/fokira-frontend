<template>
  <div class="min-h-screen flex items-center justify-center">
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else class="text-gray-500">جاري تسجيل الدخول...</div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const error = ref<string | null>(null);

onMounted(async () => {
  const token = route.query.token as string;
  const redirect = route.query.redirect as string || '/';

  if (!token) {
    error.value = 'رمز المصادقة غير صالح';
    setTimeout(() => router.push('/login'), 2000);
    return;
  }

  try {
    await authStore.login(token);
    router.push(redirect);
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'حدث خطأ أثناء تسجيل الدخول';
    setTimeout(() => router.push('/login'), 2000);
  }
});
</script>
