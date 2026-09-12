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
    <button @click="prev" :disabled="isFirstPage" aria-label="Previous Page">&lsaquo; Prev</button>
    <span class="info">Showing {{ startItem }} &ndash; {{ endItem }} of {{ totalItems }}</span>
    <button @click="next" :disabled="isLastPage" aria-label="Next Page">Next &rsaquo;</button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-top: 1rem;
}
button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.info {
  font-size: 0.875rem;
  color: #4b5563;
}
</style>
