import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { fetchItem, updateStock } from '../api/stock.api'

export function useStockItem(id: string | number) {
  const queryClient = useQueryClient()

  const itemQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchItem(id),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  const updateMutation = useMutation({
    mutationFn: (newStock: number) => updateStock(id, newStock),
    onSuccess: (data) => {
      // 1. Update the detail item cache immediately with the server-confirmed data
      queryClient.setQueryData(['product', id], data)

      // 2. Invalidate the catalogue list cache so it refetches when we navigate back
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    itemQuery,
    updateMutation,
  }
}
