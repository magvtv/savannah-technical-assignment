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
  <div class="filters">
    <div class="search-bar">
      <input
        type="text"
        v-model="search"
        @input="onSearchInput"
        placeholder="Search stock..."
        aria-label="Search stock"
      />
    </div>
    <div class="controls">
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

      <select v-model="sort" aria-label="Sort items">
        <option value="">Default Sort</option>
        <option value="title">Name (A-Z)</option>
        <option value="stock">Stock</option>
        <option value="price">Price</option>
      </select>
    </div>
    <div class="search-note" v-if="search">
      <small>Category filter is disabled while searching.</small>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}
.search-bar input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.controls {
  display: flex;
  gap: 1rem;
}
.controls select {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}
.search-note {
  color: #666;
}
</style>
