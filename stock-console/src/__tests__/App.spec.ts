import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'
import router from '../router'
import { useAuthStore } from '../features/auth/stores/useAuthStore'

describe('App', () => {
  it('mounts renders properly when authenticated', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const authStore = useAuthStore()
    authStore.setAuth({
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
      username: 'emilys',
      id: 1,
      email: 'emilys@example.com',
      firstName: 'Emily',
      lastName: 'Smith',
      gender: 'female',
      image: 'https://dummyjson.com/icon/emilys/128',
    })

    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, VueQueryPlugin],
      },
    })
    expect(wrapper.text()).toContain('Stock Console')
  })
})
