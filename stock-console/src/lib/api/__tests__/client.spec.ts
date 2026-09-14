import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { apiClient } from '../client'
import { useAuthStore } from '../../../features/auth/stores/useAuthStore'
import * as authApi from '../../../features/auth/api/auth.api'

vi.mock('../../../features/auth/api/auth.api', () => ({
  refreshSession: vi.fn<() => Promise<unknown>>(),
}))

describe('apiClient Interceptors', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('attaches auth bearer token to requests when user is logged in', async () => {
    const authStore = useAuthStore()
    authStore.setAuth({
      accessToken: 'my-access-token',
      refreshToken: 'my-refresh-token',
      username: 'emilys',
      id: 1,
      email: 'emilys@example.com',
      firstName: 'Emily',
      lastName: 'Smith',
      gender: 'female',
      image: 'https://dummyjson.com/icon/emilys/128',
    })

    const requestInterceptor = (
      apiClient.interceptors.request as unknown as {
        handlers: Array<{ fulfilled: (config: unknown) => Promise<unknown> }>
      }
    ).handlers[0]
    const config = (await requestInterceptor!.fulfilled({ headers: {} })) as {
      headers: Record<string, string>
    }

    expect(config.headers.Authorization).toBe('Bearer my-access-token')
  })

  it('handles 401 by refreshing token and retrying request', async () => {
    const authStore = useAuthStore()
    authStore.setAuth({
      accessToken: 'expired-access-token',
      refreshToken: 'valid-refresh-token',
      username: 'emilys',
      id: 1,
      email: 'emilys@example.com',
      firstName: 'Emily',
      lastName: 'Smith',
      gender: 'female',
      image: 'https://dummyjson.com/icon/emilys/128',
    })

    const newAuthData = {
      accessToken: 'fresh-access-token',
      refreshToken: 'valid-refresh-token',
      username: 'emilys',
      id: 1,
      email: 'emilys@example.com',
      firstName: 'Emily',
      lastName: 'Smith',
      gender: 'female',
      image: 'https://dummyjson.com/icon/emilys/128',
    }

    vi.mocked(authApi.refreshSession).mockResolvedValueOnce(newAuthData)

    const responseInterceptor = (
      apiClient.interceptors.response as unknown as {
        handlers: Array<{ rejected: (error: unknown) => Promise<unknown> }>
      }
    ).handlers[0]

    const originalRequest = {
      url: '/products/1',
      headers: {} as Record<string, string>,
      _retry: false,
    }
    const error401 = {
      config: originalRequest,
      response: { status: 401 },
    }

    vi.spyOn(apiClient, 'request').mockResolvedValueOnce({ data: { success: true } })

    try {
      await responseInterceptor!.rejected(error401)
    } catch {
      // expected
    }

    expect(authApi.refreshSession).toHaveBeenCalledWith('valid-refresh-token')
    expect(authStore.authState?.accessToken).toBe('fresh-access-token')
  })
})
