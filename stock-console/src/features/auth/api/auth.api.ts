import { apiClient } from '../../../lib/api/client'

export interface AuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', {
    username,
    password,
    // Savanah requirement: Short expiry for testing
    expiresInMins: 1,
  })
  return data
}

export const refreshSession = async (refreshToken: string): Promise<AuthResponse> => {
  // Use a raw axios call here or make sure interceptor avoids looping on /auth/refresh
  const { data } = await apiClient.post<AuthResponse>('/auth/refresh', {
    refreshToken,
    expiresInMins: 1,
  })
  return data
}
