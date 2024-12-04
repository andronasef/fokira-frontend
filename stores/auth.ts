import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: true,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(token: string) {
      this.loading = true;
      
      try {
        const tokenCookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: true,
          sameSite: 'lax',
          path: '/',
        });
        
        tokenCookie.value = token;
        this.token = token;
        
        await this.fetchUser();
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      if (!this.token) {
        this.user = null;
        return null;
      }

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
    },

    async initAuth() {
      this.loading = true;
      
      try {
        const tokenCookie = useCookie('auth_token');
        if (tokenCookie.value) {
          this.token = tokenCookie.value;
          await this.fetchUser();
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
