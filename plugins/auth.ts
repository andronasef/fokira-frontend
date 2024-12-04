export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  
  // Check authentication status on app start
  if (authStore.token) {
    await authStore.fetchUser();
  }
});
