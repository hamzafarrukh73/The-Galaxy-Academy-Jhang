/**
 * API Plugin
 * Provides centralized HTTP client with automatic URL and headers injection,
 * token management, and token refresh on 401 responses
 */

import { createApiClient } from '../api/client'

export default defineNuxtPlugin((_nuxtApp) => {
  // Create pre-configured $fetch instance with all interceptors
  const api = createApiClient()

  // Provide as both direct injection and via composable
  return {
    provide: {
      // Direct injection: $event.api
      api,
      // URLs injection: $event.urls
      urls: URLS
    }
  }
})

/**
 * Composable for using the pre-configured API client
 *
 * Usage:
 * const api = useApi()
 * const response = await api('/auth/login/', { method: 'POST', body: payload })
 */
export function useApi() {
  const { $api } = useNuxtApp()
  return $api
}

/**
 * Composable for accessing URLS utility from plugin
 *
 * Usage:
 * const urls = useUrls()
 * await navigateTo(urls.home)
 */
export function useUrls() {
  const { $urls } = useNuxtApp()
  return $urls
}
