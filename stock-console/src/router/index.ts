import { createRouter, createWebHistory } from 'vue-router'
import ProtectedLayout from '../app/layout/ProtectedLayout.vue'
import LoginView from '../features/auth/pages/LoginView.vue'
import CatalogueView from '../features/catalogue/pages/CatalogueView.vue'
import ItemDetailView from '../features/stock/pages/ItemDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      redirect: '/items',
    },
    {
      path: '/items',
      component: ProtectedLayout,
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

export default router
