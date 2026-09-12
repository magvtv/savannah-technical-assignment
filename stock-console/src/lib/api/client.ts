import axios from 'axios'
import { useAuthStore } from '../../features/auth/stores/useAuthStore'
import { refreshSession } from '../../features/auth/api/auth.api'
import router from '../../router'

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Attach Token
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.authState?.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.authState.accessToken}`
  }
  return config
})

// Response Interceptor: Handle 401s
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't intercept calls to the refresh endpoint itself
      if (originalRequest.url === '/auth/refresh') {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      const authStore = useAuthStore()
      
      try {
        if (!authStore.authState?.refreshToken) {
          throw new Error('No refresh token available')
        }
        
        // Attempt refresh
        const refreshedData = await refreshSession(authStore.authState.refreshToken)
        authStore.setAuth(refreshedData)
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${refreshedData.accessToken}`
        return apiClient(originalRequest)
        
      } catch (refreshError) {
        // Refresh failed, clear session and redirect to login
        authStore.clearAuth()
        const currentPath = router.currentRoute.value.fullPath
        router.push({ name: 'login', query: { redirect: currentPath } })
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)
