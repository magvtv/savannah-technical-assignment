import { apiClient } from '../../../lib/api/client'

export interface Product {
  id: number
  title: string
  category: string
  stock: number
  brand?: string
  thumbnail: string
  price: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CatalogueParams {
  search?: string
  category?: string
  sortBy?: string
  order?: 'asc' | 'desc'
  limit: number
  skip: number
}

export interface CategoryItem {
  slug: string
  name?: string
  url?: string
}

export const fetchCategories = async (): Promise<string[]> => {
  const { data } = await apiClient.get<Array<CategoryItem | string>>('/products/categories')
  // DummyJSON returns objects for categories now: { slug, name, url }
  // i map them to strings or just use the slug.
  if (data && data.length > 0 && typeof data[0] === 'object') {
    return (data as CategoryItem[]).map((c) => c.slug)
  }
  return data as string[]
}

export const fetchProducts = async (params: CatalogueParams): Promise<ProductsResponse> => {
  let endpoint = '/products'

  if (params.search) {
    endpoint = `/products/search`
  } else if (params.category) {
    endpoint = `/products/category/${params.category}`
  }

  // i add select to minimize payload size (design decision)
  const queryParams: Record<string, string | number> = {
    limit: params.limit,
    skip: params.skip,
    select: 'id,title,category,stock,brand,thumbnail,price',
  }

  if (params.search) queryParams.q = params.search
  if (params.sortBy) {
    queryParams.sortBy = params.sortBy
    queryParams.order = params.order || 'asc'
  }

  const { data } = await apiClient.get<ProductsResponse>(endpoint, { params: queryParams })
  return data
}
