import { useQuery } from '@tanstack/vue-query'
import { fetchProducts, fetchCategories, type CatalogueParams } from '../api/catalogue.api'
import { computed, type Ref } from 'vue'

export function useCatalogue(params: Ref<CatalogueParams>) {
  const productsQuery = useQuery({
    queryKey: computed(() => ['products', params.value]),
    queryFn: () => fetchProducts(params.value),
    // stale-while-revalidate caching philosophy
    staleTime: 1000 * 60 * 5, // 5 minutes for smoother user navigation without unnecessary network refetches
  })

  return {
    productsQuery,
  }
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity, // categories do not change often during a session
  })
}
