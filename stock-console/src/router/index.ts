import { createRouter, createWebHistory } from 'vue-router'
import ProtectedLayout from '../app/layout/ProtectedLayout.vue'
import LoginView from '../features/auth/pages/LoginView.vue'
import CatalogueView from '../features/catalogue/pages/CatalogueView.vue'
import ItemDetailView from '../features/stock/pages/ItemDetailView.vue'
import { useAuthStore } from '../features/auth/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      redirect: '/items',
    },
    {
      path: '/items',
      component: ProtectedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'catalogue',
          component: CatalogueView,
        },
        {
          path: ':id',
          name: 'item-detail',
          component: ItemDetailView,
        },
      ],
    },
  ],
})

// Navigation Guard
router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.authState?.accessToken

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login, preserving intended path
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresGuest && isAuthenticated) {
    // If logged in and trying to go to login page, redirect to catalogue
    return { name: 'catalogue' }
  }
})

export default router
