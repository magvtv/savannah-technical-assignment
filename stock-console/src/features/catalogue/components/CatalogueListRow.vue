<script setup lang="ts">
import type { Product } from '../api/catalogue.api'

defineProps<{
  product: Product
}>()
</script>

<template>
  <router-link :to="`/items/${product.id}`" class="list-row">
    <div class="thumbnail">
      <img :src="product.thumbnail" :alt="product.title" loading="lazy" />
    </div>
    <div class="info">
      <h3>{{ product.title }}</h3>
      <span class="category">{{ product.category }}</span>
      <span class="brand" v-if="product.brand">&middot; {{ product.brand }}</span>
    </div>
    <div class="stock-info">
      <div class="stock-count">{{ product.stock }}</div>
      <div class="stock-label">units &rarr;</div>
    </div>
  </router-link>
</template>

<style scoped>
.list-row {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
  background-color: white;
  margin-bottom: 0.5rem;
}
.list-row:hover {
  background-color: #f9fafb;
}
.thumbnail {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  margin-right: 1rem;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}
.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.info {
  flex-grow: 1;
  min-width: 0; /* allows text truncation if needed */
}
.info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.category,
.brand {
  font-size: 0.875rem;
  color: #6b7280;
}
.stock-info {
  text-align: right;
  margin-left: 1rem;
  flex-shrink: 0;
}
.stock-count {
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
}
.stock-label {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
