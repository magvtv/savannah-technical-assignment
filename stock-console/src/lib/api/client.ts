import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// We'll add auth interceptors here in Phase 5
