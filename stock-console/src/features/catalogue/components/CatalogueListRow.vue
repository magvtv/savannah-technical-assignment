<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../api/catalogue.api'

const props = defineProps<{
  product: Product
}>()

const stockStatusClass = computed(() => {
  if (props.product.stock === 0) return 'out-of-stock'
  if (props.product.stock <= 20) return 'low-stock'
  return 'in-stock'
})

const stockStatusLabel = computed(() => {
  if (props.product.stock === 0) return 'Out of Stock'
  if (props.product.stock <= 20) return 'Low Stock'
  return 'In Stock'
})
</script>

<template>
  <router-link :to="`/items/${product.id}`" class="list-row">
    <div class="thumbnail">
      <img :src="product.thumbnail" :alt="product.title" loading="lazy" />
    </div>

    <div class="info">
      <div class="title-row">
        <h3>{{ product.title }}</h3>
        <span class="price-tag">${{ product.price.toFixed(2) }}</span>
      </div>
      <div class="meta-row">
        <span class="category-badge">{{ product.category }}</span>
        <span class="brand-text" v-if="product.brand">&bull; {{ product.brand }}</span>
      </div>
    </div>

    <div class="stock-info">
      <div class="stock-badge" :class="stockStatusClass">
        <span class="status-dot"></span>
        <span class="count">{{ product.stock }}</span>
        <span class="label">units</span>
      </div>
      <span class="status-sublabel">{{ stockStatusLabel }}</span>
    </div>

    <div class="chevron">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  </router-link>
</template>

<style scoped>
.list-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  background-color: #ffffff;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.list-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e1;
}

.thumbnail {
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  background-color: #f8fafc;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.list-row:hover .thumbnail img {
  transform: scale(1.05);
}

.info {
  flex-grow: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-tag {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  flex-shrink: 0;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  border-radius: 4px;
}

.brand-text {
  font-size: 0.8rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stock-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.count {
  font-variant-numeric: tabular-nums;
}

.label {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.85;
}

.in-stock {
  background-color: #ecfdf5;
  color: #047857;
}

.in-stock .status-dot {
  background-color: #10b981;
}

.low-stock {
  background-color: #fffbebfb;
  color: #b45309;
}

.low-stock .status-dot {
  background-color: #f59e0b;
}

.out-of-stock {
  background-color: #fef2f2;
  color: #b91c1c;
}

.out-of-stock .status-dot {
  background-color: #ef4444;
}

.status-sublabel {
  font-size: 0.7rem;
  color: #94a3b8;
}

.chevron {
  color: #cbd5e1;
  display: inline-flex;
  align-items: center;
  transition:
    color 0.15s,
    transform 0.15s;
  flex-shrink: 0;
}

.list-row:hover .chevron {
  color: #2563eb;
  transform: translateX(2px);
}
</style>
