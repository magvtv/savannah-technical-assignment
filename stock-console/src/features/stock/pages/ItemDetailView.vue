<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockItem } from '../hooks/useStockItem'

const route = useRoute()
const router = useRouter()
const itemId = route.params.id as string

const { itemQuery, updateMutation } = useStockItem(itemId)

const draftStock = ref<number | null>(null)

// When item loads, populate the draft stock
watch(
  () => itemQuery.data.value?.stock,
  (newStock) => {
    if (newStock !== undefined && draftStock.value === null) {
      draftStock.value = newStock
    }
  },
  { immediate: true },
)

const saveStock = () => {
  if (draftStock.value === null || draftStock.value < 0) return
  updateMutation.mutate(draftStock.value)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="detail-view">
    <button class="back-button" @click="goBack" aria-label="Go back">
      &larr; Back to Catalogue
    </button>

    <div v-if="itemQuery.isPending.value" class="state-message">Loading item details...</div>

    <div v-else-if="itemQuery.isError.value" class="state-message error">
      <p>Failed to load this item. It may not exist or the network failed.</p>
      <button @click="itemQuery.refetch()">Retry</button>
    </div>

    <div v-else-if="itemQuery.data.value" class="content">
      <div class="hero">
        <img :src="itemQuery.data.value.thumbnail" :alt="itemQuery.data.value.title" />
      </div>

      <div class="details">
        <span class="category">{{ itemQuery.data.value.category }}</span>
        <h2>{{ itemQuery.data.value.title }}</h2>
        <p class="description">{{ itemQuery.data.value.description }}</p>

        <div class="metadata">
          <div class="meta-item"><strong>SKU:</strong> {{ itemQuery.data.value.sku }}</div>
          <div class="meta-item"><strong>Price:</strong> ${{ itemQuery.data.value.price }}</div>
          <div class="meta-item">
            <strong>Status:</strong> {{ itemQuery.data.value.availabilityStatus }}
          </div>
        </div>
      </div>

      <div class="correction-panel">
        <h3>Correct Stock Count</h3>
        <p class="helper-text">Update the system to match your physical count.</p>

        <div class="form-group">
          <label for="stock-input">Current Stock</label>
          <div class="input-row">
            <input
              id="stock-input"
              type="number"
              min="0"
              v-model="draftStock"
              :disabled="updateMutation.isPending.value"
            />
            <button
              @click="saveStock"
              :disabled="
                updateMutation.isPending.value || draftStock === itemQuery.data.value.stock
              "
              class="primary-button"
            >
              {{ updateMutation.isPending.value ? 'Saving...' : 'Save Correction' }}
            </button>
          </div>
        </div>

        <div v-if="updateMutation.isError.value" class="mutation-error">
          Couldn't update stock. Your previous value is still shown. Try again.
        </div>
        <div v-else-if="updateMutation.isSuccess.value" class="mutation-success">
          Stock successfully updated to {{ itemQuery.data.value.stock }}.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  max-width: 600px;
  margin: 0 auto;
}
.back-button {
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 0 0 1rem 0;
  font-size: 1rem;
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
.hero {
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  text-align: center;
}
.hero img {
  max-width: 100%;
  height: auto;
  max-height: 300px;
}
.details h2 {
  margin: 0.5rem 0;
  font-size: 1.5rem;
}
.category {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #6b7280;
}
.description {
  color: #4b5563;
  line-height: 1.5;
}
.metadata {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}
.correction-panel {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}
.correction-panel h3 {
  margin-top: 0;
}
.helper-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
.input-row {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
.input-row input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
.primary-button {
  padding: 0.75rem 1.5rem;
  background: #111827;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
.primary-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
.mutation-error {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 4px;
}
.mutation-success {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f0fdf4;
  color: #15803d;
  border-radius: 4px;
}
</style>
