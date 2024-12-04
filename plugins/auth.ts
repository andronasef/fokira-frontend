export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  // Initialize auth state from cookie
  authStore.initAuth();

  // If we have a token, try to fetch the user
  if (authStore.token) {
    await authStore.fetchUser();
  }
});
