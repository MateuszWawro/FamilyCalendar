import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(email, password) {
      const res = await axios.post('http://localhost:3000/login', { email, password })
      this.user = res.data.user
      this.token = res.data.token
    },
    logout() {
      this.user = null
      this.token = null
    },
    isAuthenticated() {
      return !!this.user
    },
  },
})