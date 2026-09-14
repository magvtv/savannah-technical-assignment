<script setup lang="ts">
import { useCatalogueParams } from '../hooks/useCatalogueParams'
import { useCatalogue } from '../hooks/useCatalogue'
import CatalogueFilters from '../components/CatalogueFilters.vue'
import CatalogueListRow from '../components/CatalogueListRow.vue'
import CataloguePagination from '../components/CataloguePagination.vue'
import StateCard from '../../../app/components/StateCard.vue'

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

    <StateCard
      v-if="productsQuery.isPending.value"
      type="loading"
      message="Fetching stock data..."
    />

    <StateCard
      v-else-if="productsQuery.isError.value"
      type="error"
      title="Failed to Load Stock"
      message="We couldn't retrieve inventory details at this moment."
      actionText="Try Again"
      @action="productsQuery.refetch()"
    />

    <StateCard
      v-else-if="productsQuery.data.value?.products.length === 0"
      type="empty"
      title="No Products Found"
      message="No inventory items match your active search or category filters."
      :actionText="params.search || params.category ? 'Clear Active Filters' : undefined"
      @action="updateParams({ search: '', category: '' })"
    />

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

.list-container {
  display: flex;
  flex-direction: column;
}
</style>
