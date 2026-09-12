<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../api/auth.api'
import { useAuthStore } from '../stores/useAuthStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('emilys')
const password = ref('emilyspass')
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please enter both username and password.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const data = await login(username.value, password.value)
    authStore.setAuth(data)
    
    // Redirect to intended URL or default to catalogue
    const redirectPath = (route.query.redirect as string) || '/items'
    router.push(redirectPath)
  } catch {
    errorMessage.value = 'Login failed. Please check your credentials.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Console Sign In</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" type="text" v-model="username" :disabled="isSubmitting" />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" :disabled="isSubmitting" />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isSubmitting" class="primary-button">
          {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="test-credentials">
        <p><strong>Test Credentials:</strong></p>
        <p>User: emilys<br/> Pass: emilyspass</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 1rem;
}
.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
.login-box h2 {
  margin-top: 0;
  text-align: center;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
}
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}
.error-message {
  color: #b91c1c;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}
.primary-button {
  width: 100%;
  padding: 0.75rem;
  background: #111827;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
.primary-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
.test-credentials {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #4b5563;
  text-align: center;
}
</style>
