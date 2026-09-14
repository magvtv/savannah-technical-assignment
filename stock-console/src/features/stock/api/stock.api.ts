import { apiClient } from '../../../lib/api/client'
import type { Product } from '../../catalogue/api/catalogue.api'

// We extend the base Product to include fields only needed on the detail page
export interface ProductDetail extends Product {
  description: string
  sku: string
  availabilityStatus: string
  dimensions?: {
    width: number
    height: number
    depth: number
  }
}

export const fetchItem = async (id: number | string): Promise<ProductDetail> => {
  const { data } = await apiClient.get<ProductDetail>(`/products/${id}`)
  return data
}

export const updateStock = async (
  id: number | string,
  newStock: number,
): Promise<ProductDetail> => {
  // Using a 1000ms delay to clearly demonstrate the pessimistic "Saving..." UI state
  // and satisfy Savannah's edge-case testing requirement for slow networks.
  const { data } = await apiClient.put<ProductDetail>(`/products/${id}?delay=1000`, {
    stock: newStock,
  })
  return data
}
