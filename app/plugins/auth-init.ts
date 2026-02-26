/**
 * Auth Initialization Plugin
 * Restores user session on app startup
 */

export default defineNuxtPlugin(async (_nuxtApp) => {
  // Skip session restoration on server-side
  if (import.meta.server) return

  // Get auth store
  const auth = useAuthStore()

  // Restore session on app initialization
  // This validates existing cookies and ensures consistent auth state
  await auth.restoreSession()
})
