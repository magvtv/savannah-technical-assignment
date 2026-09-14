<script setup lang="ts">
defineProps<{
  type: 'loading' | 'error' | 'empty'
  title?: string
  message?: string
  actionText?: string
}>()

const emit = defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div class="state-card" :class="type">
    <template v-if="type === 'loading'">
      <div class="spinner"></div>
      <p>{{ message || 'Loading...' }}</p>
    </template>

    <template v-else-if="type === 'error'">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
      </svg>
      <h3 v-if="title">{{ title }}</h3>
      <p v-if="message">{{ message }}</p>
      <button v-if="actionText" @click="emit('action')" class="action-button">{{ actionText }}</button>
    </template>

    <template v-else-if="type === 'empty'">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
      <h3 v-if="title">{{ title }}</h3>
      <p v-if="message">{{ message }}</p>
      <button v-if="actionText" @click="emit('action')" class="action-button">{{ actionText }}</button>
    </template>
  </div>
</template>

<style scoped>
.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1.5rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  margin: 1rem 0;
}

.state-card.loading {
  gap: 1rem;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-card.error {
  color: #dc2626;
  background-color: #fef2f2;
  border-color: #fca5a5;
}

.state-card.error svg {
  color: #dc2626;
}

.state-card.empty svg {
  color: #94a3b8;
}

.state-card h3 {
  margin: 0.75rem 0 0.25rem 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: inherit;
}

.action-button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #111827;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.action-button:hover {
  background-color: #1f2937;
}
</style>
