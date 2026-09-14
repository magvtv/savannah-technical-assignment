import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginView from '../LoginView.vue'

// Mock vue-router
const mockPush = vi.fn<() => void>()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ query: {} }),
}))

// Mock auth api
vi.mock('../../api/auth.api', () => ({
  login: vi.fn<() => Promise<unknown>>().mockResolvedValue({
    id: 1,
    username: 'emilys',
    email: 'emilys@example.com',
    firstName: 'Emily',
    lastName: 'Smith',
    gender: 'female',
    image: 'https://dummyjson.com/icon/emilys/128',
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  }),
}))

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockPush.mockClear()
  })

  it('renders login form properly', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('h2').text()).toContain('Console Sign In')
    expect(wrapper.find('#username').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('toggles password visibility when eye icon button is clicked', async () => {
    const wrapper = mount(LoginView)
    const passwordInput = wrapper.find('#password')
    const eyeToggleBtn = wrapper.find('.eye-toggle')

    // Initial state: password input type should be 'password'
    expect(passwordInput.attributes('type')).toBe('password')

    // Click eye toggle button
    await eyeToggleBtn.trigger('click')

    // State after toggle: password input type should be 'text'
    expect(passwordInput.attributes('type')).toBe('text')

    // Click again to toggle back
    await eyeToggleBtn.trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('displays test credentials hint text', () => {
    const wrapper = mount(LoginView)
    const credentialsText = wrapper.find('.test-credentials')
    expect(credentialsText.text()).toContain('User: emilys')
    expect(credentialsText.text()).toContain('Pass: emilyspass')
  })
})
