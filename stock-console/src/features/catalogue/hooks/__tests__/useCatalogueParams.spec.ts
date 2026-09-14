import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useCatalogueParams } from '../useCatalogueParams'

const routes = [{ path: '/items', name: 'items', component: { template: '<div>Items</div>' } }]

describe('useCatalogueParams Hook', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes,
    })
  })

  it('resets page to 1 when category filter changes from page 3', async () => {
    await router.push('/items?page=3&sort=title-asc')
    await router.isReady()

    let hookResult: ReturnType<typeof useCatalogueParams>

    const TestComponent = defineComponent({
      setup() {
        hookResult = useCatalogueParams()
        return () => null
      },
    })

    mount(TestComponent, {
      global: {
        plugins: [router],
      },
    })

    expect(hookResult!.currentPage.value).toBe(3)

    // Update filter with category 'groceries'
    await hookResult!.updateParams({ category: 'groceries' })

    // Verify query page is reset to 1
    expect(router.currentRoute.value.query.page).toBe('1')
    expect(router.currentRoute.value.query.category).toBe('groceries')
    expect(hookResult!.currentPage.value).toBe(1)
  })
})
