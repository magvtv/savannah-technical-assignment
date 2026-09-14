import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { useStockItem } from '../useStockItem'
import * as stockApi from '../../api/stock.api'

vi.mock('../../api/stock.api', () => ({
  fetchItem: vi.fn<() => Promise<unknown>>(),
  updateStock: vi.fn<() => Promise<unknown>>(),
}))

describe('useStockItem Hook', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  it('handles pessimistic rollback on update failure without corrupting cache', async () => {
    const mockProduct = {
      id: 1,
      title: 'Essence Mascara',
      description: 'Volumizing mascara',
      category: 'beauty',
      price: 9.99,
      stock: 99,
      sku: 'BEA-001',
      brand: 'Essence',
      availabilityStatus: 'In Stock',
      thumbnail: 'https://dummyjson.com/thumb.jpg',
    }

    vi.mocked(stockApi.fetchItem).mockResolvedValue(mockProduct)
    vi.mocked(stockApi.updateStock).mockRejectedValue(new Error('500 Internal Server Error'))

    let hookResult: ReturnType<typeof useStockItem>

    const TestComponent = defineComponent({
      setup() {
        hookResult = useStockItem('1')
        return () => null
      },
    })

    mount(TestComponent, {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })

    // Seed query cache
    queryClient.setQueryData(['product', '1'], mockProduct)

    expect(hookResult!.itemQuery.data.value?.stock).toBe(99)

    // Trigger failed mutation
    try {
      await hookResult!.updateMutation.mutateAsync(50)
    } catch {
      // Expected mutation rejection
    }

    // Assert error state is set and cache retains original stock value of 99
    expect(hookResult!.updateMutation.isError.value).toBe(true)
    const cachedData = queryClient.getQueryData<typeof mockProduct>(['product', '1'])
    expect(cachedData?.stock).toBe(99)
  })
})
