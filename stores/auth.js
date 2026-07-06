import { defineStore } from 'pinia'
import { login } from '../api/documents'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || ''
  }),
  actions: {
    async signIn(form) {
      const { data } = await login(form)
      this.token = data.token
      this.username = data.displayName || data.username
      localStorage.setItem('token', this.token)
      localStorage.setItem('username', this.username)
    },
    signOut() {
      this.token = ''
      this.username = ''
      localStorage.clear()
    }
  }
})
