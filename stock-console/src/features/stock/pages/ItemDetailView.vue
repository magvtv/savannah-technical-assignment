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

const adjustStock = (delta: number) => {
  if (draftStock.value === null) draftStock.value = 0
  const newVal = draftStock.value + delta
  draftStock.value = Math.max(0, newVal)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="detail-view">
    <button class="back-button" @click="goBack" aria-label="Go back to catalogue">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
      <span>Back to Catalogue</span>
    </button>

    <div v-if="itemQuery.isPending.value" class="state-card loading">
      <div class="spinner"></div>
      <p>Loading item details...</p>
    </div>

    <div v-else-if="itemQuery.isError.value" class="state-card error">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      <h3>Item Not Found</h3>
      <p>Failed to load this item. It may not exist or network connection failed.</p>
      <button @click="itemQuery.refetch()" class="action-button">Retry</button>
    </div>

    <div v-else-if="itemQuery.data.value" class="content">
      <div class="hero-card">
        <div class="image-wrapper">
          <img :src="itemQuery.data.value.thumbnail" :alt="itemQuery.data.value.title" />
        </div>
      </div>

      <div class="details-card">
        <span class="category-badge">{{ itemQuery.data.value.category }}</span>
        <h2>{{ itemQuery.data.value.title }}</h2>
        <p class="description">{{ itemQuery.data.value.description }}</p>

        <div class="metrics-grid">
          <div class="metric-chip">
            <span class="metric-label">SKU</span>
            <code class="metric-val sku">{{ itemQuery.data.value.sku }}</code>
          </div>

          <div class="metric-chip">
            <span class="metric-label">Price</span>
            <span class="metric-val price">${{ itemQuery.data.value.price.toFixed(2) }}</span>
          </div>

          <div class="metric-chip">
            <span class="metric-label">Status</span>
            <span
              class="metric-val status-badge"
              :class="itemQuery.data.value.stock > 0 ? 'in-stock' : 'out-of-stock'"
            >
              {{ itemQuery.data.value.availabilityStatus || (itemQuery.data.value.stock > 0 ? 'In Stock' : 'Out of Stock') }}
            </span>
          </div>
        </div>
      </div>

      <div class="correction-card">
        <div class="card-header">
          <div>
            <h3>Correct Stock Count</h3>
            <p class="helper-text">Update the system stock count to match physical count.</p>
          </div>
        </div>

        <div class="form-group">
          <label for="stock-input">Current System Stock</label>
          <div class="stock-input-wrapper">
            <div class="stepper-group">
              <button
                type="button"
                class="step-btn"
                @click="adjustStock(-1)"
                :disabled="updateMutation.isPending.value || (draftStock !== null && draftStock <= 0)"
                aria-label="Decrease stock"
              >
                &minus;
              </button>
              <input
                id="stock-input"
                type="number"
                min="0"
                v-model="draftStock"
                :disabled="updateMutation.isPending.value"
              />
              <button
                type="button"
                class="step-btn"
                @click="adjustStock(1)"
                :disabled="updateMutation.isPending.value"
                aria-label="Increase stock"
              >
                &#43;
              </button>
            </div>

            <button
              @click="saveStock"
              :disabled="
                updateMutation.isPending.value || draftStock === itemQuery.data.value.stock || draftStock === null || draftStock < 0
              "
              class="primary-button"
            >
              <span v-if="updateMutation.isPending.value" class="button-spinner"></span>
              <span>{{ updateMutation.isPending.value ? 'Saving...' : 'Save Correction' }}</span>
            </button>
          </div>
        </div>

        <div v-if="updateMutation.isError.value" class="mutation-error" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>Couldn't update stock count. Please try again.</span>
        </div>
        <div v-else-if="updateMutation.isSuccess.value" class="mutation-success" role="status">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Stock count successfully updated to <strong>{{ itemQuery.data.value.stock }}</strong> units.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide standard HTML5 number input arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}

.detail-view {
  max-width: 680px;
  margin: 0 auto;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
  cursor: pointer;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;
}

.back-button:hover {
  background-color: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
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
}

.hero-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.image-wrapper {
  max-width: 320px;
  max-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 280px;
  object-fit: contain;
}

.details-card {
  background: white;
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.25rem;
}

.category-badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
  margin-bottom: 0.6rem;
}

.details-card h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.description {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.55;
  margin: 0 0 1.25rem 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.metric-chip {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}

.metric-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.metric-val.sku {
  font-family: monospace;
  font-size: 0.85rem;
}

.status-badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-badge.in-stock {
  color: #047857;
}

.status-badge.out-of-stock {
  color: #b91c1c;
}

.correction-card {
  background: white;
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  margin-bottom: 1.25rem;
}

.card-header h3 {
  margin: 0 0 0.2rem 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.helper-text {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
}

.stock-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stepper-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.step-btn {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.step-btn:hover:not(:disabled) {
  background: #e2e8f0;
  color: #0f172a;
}

.step-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stepper-group input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 0.85rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.stepper-group input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.primary-button {
  width: 100%;
  height: 44px;
  padding: 0 1.25rem;
  background: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.15s;
  flex-shrink: 0;
}

.primary-button:hover:not(:disabled) {
  background: #1f2937;
}

.primary-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.mutation-error,
.mutation-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.mutation-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.mutation-success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

@media (min-width: 640px) {
  .stock-input-wrapper {
    flex-direction: row;
  }
  .stepper-group {
    flex: 1;
  }
  .primary-button {
    width: auto;
    flex-shrink: 0;
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
