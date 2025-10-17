import { defineStore } from 'pinia';
import { authAPI } from '../api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authAPI.login(email, password);
        
        if (response.data.success) {
          this.user = response.data.data.user;
          this.token = response.data.data.token;

          // Zapisz w localStorage
          localStorage.setItem('user', JSON.stringify(this.user));
          localStorage.setItem('token', this.token);

          return { success: true };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Błąd logowania';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(email, password, name) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authAPI.register(email, password, name);
        
        if (response.data.success) {
          this.user = response.data.data.user;
          this.token = response.data.data.token;

          localStorage.setItem('user', JSON.stringify(this.user));
          localStorage.setItem('token', this.token);

          return { success: true };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Błąd rejestracji';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.error = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    async loadProfile() {
      if (!this.token) return;

      try {
        const response = await authAPI.getProfile();
        if (response.data.success) {
          this.user = response.data.data;
          localStorage.setItem('user', JSON.stringify(this.user));
        }
      } catch (error) {
        console.error('Błąd ładowania profilu:', error);
        this.logout();
      }
    }
  }
});