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
        <h1>Stock Console</h1>
      </div>
      <div class="user-menu" v-if="authStore.authState">
        <span class="greeting">Hello, {{ authStore.authState.firstName }}</span>
        <img :src="authStore.authState.image" alt="Profile picture" class="avatar" v-if="authStore.authState.image" />
        <button @click="logout" class="logout-btn">Log Out</button>
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
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo h1 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.greeting {
  color: #4b5563;
  font-size: 0.875rem;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f3f4f6;
}
.logout-btn {
  background: none;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  color: #374151;
}
.logout-btn:hover {
  background-color: #f9fafb;
}
main {
  padding: 2rem 1rem;
  flex-grow: 1;
  background-color: #f9fafb;
}
</style>
