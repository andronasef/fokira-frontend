export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  // If user is not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo(`${config.public.apiBase}/auth/google`, {
      external: true,
    });
  }
});
