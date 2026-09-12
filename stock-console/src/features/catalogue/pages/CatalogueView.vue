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
      <h2>Stock</h2>
      <p class="subtitle">Find and manage clinic stock</p>
    </header>

    <CatalogueFilters
      :initial-search="params.search || ''"
      :initial-category="params.category || ''"
      :initial-sort="params.sortBy || ''"
      @update:search="updateParams({ search: $event })"
      @update:category="updateParams({ category: $event })"
      @update:sort="updateParams({ sort: $event })"
    />

    <div v-if="productsQuery.isPending.value" class="state-message">Loading stock...</div>

    <div v-else-if="productsQuery.isError.value" class="state-message error">
      <p>Failed to load stock.</p>
      <button @click="productsQuery.refetch()">Retry</button>
    </div>

    <div v-else-if="productsQuery.data.value?.products.length === 0" class="state-message empty">
      <p>No stock found matching your criteria.</p>
      <button
        v-if="params.search || params.category"
        @click="updateParams({ search: '', category: '' })"
      >
        Clear filters
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
  max-width: 800px;
  margin: 0 auto;
}
.catalogue-header {
  margin-bottom: 1.5rem;
}
.catalogue-header h2 {
  margin: 0;
  font-size: 1.5rem;
}
.subtitle {
  color: #6b7280;
  margin: 0;
}
.state-message {
  padding: 3rem 1rem;
  text-align: center;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
}
.error {
  color: #b91c1c;
  background: #fef2f2;
  border-color: #fca5a5;
}
.error button,
.empty button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.list-container {
  display: flex;
  flex-direction: column;
}
</style>
