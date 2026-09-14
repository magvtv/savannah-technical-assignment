<script setup lang="ts">
import { computed } from 'vue'
import { PAGE_SIZE } from '../hooks/useCatalogueParams'

const props = defineProps<{
  currentPage: number
  totalItems: number
}>()

const emit = defineEmits<{
  (e: 'changePage', page: number): void
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / PAGE_SIZE))
const isFirstPage = computed(() => props.currentPage <= 1)
const isLastPage = computed(() => props.currentPage >= totalPages.value)

const startItem = computed(() => (props.currentPage - 1) * PAGE_SIZE + 1)
const endItem = computed(() => Math.min(props.currentPage * PAGE_SIZE, props.totalItems))

const next = () => {
  if (!isLastPage.value) emit('changePage', props.currentPage + 1)
}

const prev = () => {
  if (!isFirstPage.value) emit('changePage', props.currentPage - 1)
}
</script>

<template>
  <div class="pagination" v-if="totalItems > 0">
    <button @click="prev" :disabled="isFirstPage" class="nav-btn" aria-label="Previous Page">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      <span>Prev</span>
    </button>

    <div class="info-badge">
      <span>Showing <strong>{{ startItem }} &ndash; {{ endItem }}</strong> of <strong>{{ totalItems }}</strong></span>
    </div>

    <button @click="next" :disabled="isLastPage" class="nav-btn" aria-label="Next Page">
      <span>Next</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0.5rem 0.5rem 0.5rem;
  margin-top: 0.5rem;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;
}

.nav-btn:hover:not(:disabled) {
  background-color: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

.nav-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.info-badge {
  font-size: 0.85rem;
  color: #64748b;
  background-color: #ffffff;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.info-badge strong {
  color: #0f172a;
}
</style>
