<script setup lang="ts">
import { useCatalogueParams } from '../hooks/useCatalogueParams'
import { useCatalogue } from '../hooks/useCatalogue'
import CatalogueFilters from '../components/CatalogueFilters.vue'
import CatalogueListRow from '../components/CatalogueListRow.vue'
import CataloguePagination from '../components/CataloguePagination.vue'

const { params, currentPage, updateParams } = useCatalogueParams()
const { productsQuery } = useCatalogue(params)
</script>

<template>
  <div class="catalogue-view">
    <header class="catalogue-header">
      <div class="title-group">
        <h2>Stock Inventory</h2>
        <p class="subtitle">Search, inspect, and manage clinic stock items</p>
      </div>
      <div class="header-badge" v-if="productsQuery.data.value">
        <span class="badge-count">{{ productsQuery.data.value.total }}</span>
        <span class="badge-label">Total Items</span>
      </div>
    </header>

    <CatalogueFilters
      :initial-search="params.search || ''"
      :initial-category="params.category || ''"
      :initial-sort="params.sortBy || ''"
      @update:search="updateParams({ search: $event })"
      @update:category="updateParams({ category: $event })"
      @update:sort="updateParams({ sort: $event })"
    />

    <div v-if="productsQuery.isPending.value" class="state-card loading">
      <div class="spinner"></div>
      <p>Fetching stock data...</p>
    </div>

    <div v-else-if="productsQuery.isError.value" class="state-card error">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      <h3>Failed to Load Stock</h3>
      <p>We couldn't retrieve inventory details at this moment.</p>
      <button @click="productsQuery.refetch()" class="action-button">Try Again</button>
    </div>

    <div v-else-if="productsQuery.data.value?.products.length === 0" class="state-card empty">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      <h3>No Products Found</h3>
      <p>No inventory items match your active search or category filters.</p>
      <button
        v-if="params.search || params.category"
        @click="updateParams({ search: '', category: '' })"
        class="action-button"
      >
        Clear Active Filters
      </button>
    </div>

    <div v-else class="list-container">
      <CatalogueListRow
        v-for="product in productsQuery.data.value?.products"
        :key="product.id"
        :product="product"
      />

      <CataloguePagination
        :current-page="currentPage"
        :total-items="productsQuery.data.value?.total || 0"
        @change-page="updateParams({ page: $event })"
      />
    </div>
  </div>
</template>

<style scoped>
.catalogue-view {
  max-width: 820px;
  margin: 0 auto;
}

.catalogue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.catalogue-header h2 {
  margin: 0;
  font-size: 1.65rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #64748b;
  margin: 0.3rem 0 0 0;
  font-size: 0.9rem;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.badge-count {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2563eb;
}

.badge-label {
  font-size: 0.8rem;
  color: #64748b;
}

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

.state-card h3 {
  margin: 0.75rem 0 0.25rem 0;
  color: #1e293b;
  font-size: 1.1rem;
}

.state-card.error {
  color: #dc2626;
  background-color: #fef2f2;
  border-color: #fca5a5;
}

.state-card.error svg {
  color: #dc2626;
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
  transition: background-color 0.15s;
}

.action-button:hover {
  background-color: #1f2937;
}

.list-container {
  display: flex;
  flex-direction: column;
}
</style>
