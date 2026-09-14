<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../features/auth/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.clearAuth()
  router.push('/login')
}
</script>

<template>
  <div class="protected-layout">
    <header>
      <div class="logo">
        <div class="brand-logo-icon">
          <svg
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
            <path d="m7.5 4.27 9 5.15" />
            <path
              d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
            />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        </div>
        <h1>Stock Console</h1>
      </div>

      <div class="user-menu" v-if="authStore.authState">
        <div class="user-badge" :title="`Logged in as ${authStore.authState.firstName}`">
          <span class="user-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span class="greeting"
            ><span class="greeting-prefix">Hello, </span
            ><strong>{{ authStore.authState.firstName }}</strong></span
          >
        </div>

        <button @click="logout" class="logout-btn" title="Log out of session" aria-label="Log out">
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <span class="logout-text">Log Out</span>
        </button>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.protected-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 0.85rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #111827;
  color: #38bdf8;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(17, 24, 39, 0.12);
  flex-shrink: 0;
}

.logo h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  white-space: nowrap;
}

.user-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  flex-shrink: 0;
}

.greeting {
  color: #334155;
  font-size: 0.875rem;
}

.greeting strong {
  color: #0f172a;
  font-weight: 600;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.logout-btn:hover {
  background-color: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
}

.logout-btn:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 1px;
}

main {
  padding: 2rem 1rem;
  flex-grow: 1;
  background-color: #f9fafb;
}

@media (max-width: 640px) {
  header {
    padding: 0.75rem 1rem;
  }

  .logo {
    gap: 0.5rem;
  }

  .brand-logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo h1 {
    font-size: 1rem;
  }

  .user-menu {
    gap: 0.5rem;
  }

  .user-badge {
    padding: 0.35rem 0.65rem;
  }

  .greeting-prefix {
    display: none;
  }

  .logout-btn {
    padding: 0.4rem 0.65rem;
  }
}

@media (max-width: 440px) {
  .logout-text {
    display: none;
  }

  .logout-btn {
    padding: 0.45rem;
    border-radius: 8px;
  }
}
</style>
