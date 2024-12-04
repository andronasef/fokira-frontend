import { defineStore } from 'pinia';
import { useCookie } from '#app';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: useCookie('auth_token').value as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(token: string) {
      const tokenCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      
      tokenCookie.value = token;
      this.token = token;
      
      await this.fetchUser();
    },

    async fetchUser() {
      if (!this.token) return null;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ user: User }>(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        
        this.user = response.user;
        return response.user;
      } catch (error) {
        this.logout();
        return null;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      const tokenCookie = useCookie('auth_token');
      tokenCookie.value = null;
      navigateTo('/login');
    },
  },
});
