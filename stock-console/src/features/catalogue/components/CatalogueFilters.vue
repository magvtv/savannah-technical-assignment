<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCategories } from '../hooks/useCatalogue'

const props = defineProps<{
  initialSearch: string
  initialCategory: string
  initialSort: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:category', value: string): void
  (e: 'update:sort', value: string): void
}>()

const { data: categories, isLoading: isLoadingCategories } = useCategories()

const search = ref(props.initialSearch)
let debounceTimeout: ReturnType<typeof setTimeout> | undefined

const onSearchInput = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emit('update:search', search.value)
  }, 300)
}

const clearSearch = () => {
  search.value = ''
  emit('update:search', '')
}

// Watchers for immediate updates on selects
const category = ref(props.initialCategory)
watch(category, (newVal) => emit('update:category', newVal))

const sort = ref(props.initialSort)
watch(sort, (newVal) => emit('update:sort', newVal))

// Sync props if URL changes from outside
watch(
  () => props.initialSearch,
  (newVal) => (search.value = newVal),
)
watch(
  () => props.initialCategory,
  (newVal) => (category.value = newVal),
)
watch(
  () => props.initialSort,
  (newVal) => (sort.value = newVal),
)
</script>

<template>
  <div class="filters-card">
    <div class="search-bar">
      <span class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input
        type="text"
        v-model="search"
        @input="onSearchInput"
        placeholder="Search stock by name..."
        aria-label="Search stock"
      />
      <button
        v-if="search"
        type="button"
        class="clear-search-btn"
        @click="clearSearch"
        aria-label="Clear search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="controls-row">
      <div class="select-wrapper">
        <select
          v-model="category"
          aria-label="Filter by category"
          :disabled="!!search || isLoadingCategories"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <span class="select-chevron">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>

      <div class="select-wrapper">
        <select v-model="sort" aria-label="Sort items">
          <option value="">Default Sort</option>
          <option value="title">Name (A-Z)</option>
          <option value="stock">Stock Quantity</option>
          <option value="price">Price</option>
        </select>
        <span class="select-chevron">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>
    </div>

    <div class="search-note" v-if="search">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      <span>Category filter is suspended during active text search.</span>
    </div>
  </div>
</template>

<style scoped>
.filters-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  color: #9ca3af;
  display: inline-flex;
  align-items: center;
  pointer-events: none;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.6rem;
  font-size: 0.95rem;
  color: #1f2937;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-bar input:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.clear-search-btn {
  position: absolute;
  right: 0.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background-color: #e5e7eb;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.15s;
}

.clear-search-btn:hover {
  background-color: #d1d5db;
  color: #111827;
}

.controls-row {
  display: flex;
  gap: 0.85rem;
}

.select-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.select-wrapper select {
  width: 100%;
  padding: 0.65rem 2.25rem 0.65rem 0.85rem;
  font-size: 0.9rem;
  color: #374151;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-wrapper select:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.select-wrapper select:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.select-chevron {
  position: absolute;
  right: 0.75rem;
  color: #6b7280;
  pointer-events: none;
  display: inline-flex;
  align-items: center;
}

.search-note {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #6b7280;
  padding: 0.35rem 0.5rem;
  background: #f3f4f6;
  border-radius: 6px;
}

@media (max-width: 640px) {
  .controls-row {
    flex-direction: column;
  }
}
</style>
