import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CatalogueParams } from '../api/catalogue.api'

export const PAGE_SIZE = 20

export function useCatalogueParams() {
  const route = useRoute()
  const router = useRouter()

  const params = computed<CatalogueParams>(() => {
    const page = parseInt(route.query.page as string) || 1
    const skip = (page - 1) * PAGE_SIZE

    return {
      search: route.query.search as string | undefined,
      category: route.query.category as string | undefined,
      sortBy: route.query.sort as string | undefined,
      order: (route.query.order as 'asc' | 'desc') || 'asc',
      limit: PAGE_SIZE,
      skip,
    }
  })

  const currentPage = computed(() => {
    return parseInt(route.query.page as string) || 1
  })

  const updateParams = async (updates: {
    search?: string
    category?: string
    sort?: string
    page?: number
  }) => {
    const query = { ...route.query }
    let resetPage = false

    const filterKeys: Array<'search' | 'category' | 'sort'> = ['search', 'category', 'sort']
    filterKeys.forEach((key) => {
      if (updates[key] !== undefined) {
        if (updates[key]) query[key] = updates[key]
        else delete query[key]
        resetPage = true
      }
    })

    if (updates.page !== undefined) {
      query.page = updates.page.toString()
    } else if (resetPage) {
      query.page = '1'
    }

    await router.replace({ query })
  }

  return {
    params,
    currentPage,
    updateParams,
  }
}
