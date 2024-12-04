import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUser(user: User) {
      this.user = user;
    },

    async checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) return;

      this.loading = true;
      this.error = null;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ user: User }>(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.token = token;
        this.user = response.user;
      } catch (error) {
        console.error('Auth check failed:', error);
        this.logout();
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
  },
})
