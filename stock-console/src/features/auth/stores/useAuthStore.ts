import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthResponse } from '../api/auth.api'

export const useAuthStore = defineStore('auth', () => {
  // We use sessionStorage to persist the state across reloads in the same tab (Ward tablet use case)
  const storedAuth = sessionStorage.getItem('auth_state')
  const authState = ref<AuthResponse | null>(storedAuth ? JSON.parse(storedAuth) : null)

  const setAuth = (auth: AuthResponse) => {
    authState.value = auth
    sessionStorage.setItem('auth_state', JSON.stringify(auth))
  }

  const clearAuth = () => {
    authState.value = null
    sessionStorage.removeItem('auth_state')
  }

  return {
    authState,
    setAuth,
    clearAuth
  }
})
