/**
 * Centralized HTTP Client
 * Pre-configured $fetch instance with automatic URL, headers, and error handling
 */

import { parseApiError } from './errors'

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: Record<string, unknown> | unknown
  requiresAuth?: boolean
  headers?: Record<string, string>
}

/**
 * Create pre-configured API client
 */
export function createApiClient() {
  const config = useRuntimeConfig()
  const baseURL = `${config.public.apiBase}/api/v1`

  return $fetch.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    async onRequest({ options }) {
      // Inject Authorization header if token exists
      const token = useCookie('accessToken').value
      if (token) {
        if (options.headers && typeof options.headers === 'object') {
          (options.headers as unknown as Record<string, string>).Authorization = `Bearer ${token}`
        }
      }
    },
    async onResponseError({ response }) {
      // Handle 401 - token expired
      if (response.status === 401) {
        try {
          const authStore = useAuthStore()
          authStore.logout()
          await navigateTo(URLS.auth.login)
        } catch (e) {
          console.error('Error handling 401:', e)
        }
      }
    }
  })
}

/**
 * Universal request handler with error parsing
 */
export async function apiRequest<T = Record<string, unknown>>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const client = useNuxtApp().$api as ReturnType<typeof createApiClient>

  try {
    const response = await client<T>(endpoint, {
      method: options.method || 'GET',
      body: options.body as Record<string, unknown> | undefined,
      headers: options.headers
    })

    return response
  } catch (error: unknown) {
    const apiError = parseApiError(error)
    throw apiError
  }
}
