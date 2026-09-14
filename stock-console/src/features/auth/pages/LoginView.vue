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
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!username.value.trim() || !password.value) {
    errorMessage.value = 'Please enter both username and password.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const data = await login(username.value.trim(), password.value)
    authStore.setAuth(data)

    // Redirect to intended URL or default to catalogue
    const redirectPath = (route.query.redirect as string) || '/items'
    router.push(redirectPath)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const res = (err as { response?: { data?: { message?: string } } }).response
      errorMessage.value = res?.data?.message || 'Login failed. Please check your credentials.'
    } else {
      errorMessage.value = 'Login failed. Please check your network or credentials.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="brand-header">
        <div class="brand-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m7.5 4.27 9 5.15" />
            <path
              d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
            />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        </div>
        <h2>Console Sign In</h2>
        <p class="subtitle">Access your Stock Management System</p>
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-wrapper">
            <input
              id="username"
              type="text"
              v-model="username"
              :disabled="isSubmitting"
              placeholder="Enter username"
              autocomplete="username"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper password-wrapper">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              :disabled="isSubmitting"
              placeholder="Enter password"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="eye-toggle"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :title="showPassword ? 'Hide password' : 'Show password'"
              @click="togglePasswordVisibility"
              :disabled="isSubmitting"
            >
              <!-- Eye Open (shown when password is hidden) -->
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <!-- Eye Off / Slashed (shown when password is visible) -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path
                  d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                />
                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <button type="submit" :disabled="isSubmitting" class="primary-button">
          <span v-if="isSubmitting" class="spinner"></span>
          <span>{{ isSubmitting ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>

      <div class="test-credentials">
        <p><strong>Test Credentials:</strong></p>
        <p>User: emilys<br />Pass: emilyspass</p>
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
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.08),
    0 8px 10px -6px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 420px;
}

.brand-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: #111827;
  color: #38bdf8;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.15);
}

.brand-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.brand-header .subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1f2937;
  background-color: #fff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.password-wrapper input {
  padding-right: 2.75rem;
}

.form-group input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.form-group input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.eye-toggle {
  position: absolute;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition:
    color 0.15s,
    background-color 0.15s;
}

.eye-toggle:hover:not(:disabled) {
  color: #111827;
  background-color: #f3f4f6;
}

.eye-toggle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.eye-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

.error-message svg {
  flex-shrink: 0;
}

.primary-button {
  width: 100%;
  padding: 0.85rem 1rem;
  background: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.primary-button:hover:not(:disabled) {
  background-color: #1f2937;
}

.primary-button:active:not(:disabled) {
  transform: translateY(1px);
}

.primary-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.test-credentials {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #4b5563;
  text-align: center;
}

.test-credentials p {
  margin: 0;
  line-height: 1.5;
}
</style>
