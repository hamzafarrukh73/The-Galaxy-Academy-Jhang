/**
 * Protected Layout Middleware
 * Use in layouts to require authentication before rendering
 * Add this to layout<Meta name="auth" content="private" />
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // Skip on server-side
  if (import.meta.server) return

  // Check if layout is protected
  const layoutAuth = to.meta.layout as string | undefined
  if (!layoutAuth || layoutAuth === 'default') return

  // Validate session before layout renders
  if (!auth.validateSession()) {
    auth.logout()
    await navigateTo(URLS.auth.login)
    return
  }

  // Check if authenticated for private layouts
  if (layoutAuth === 'private' && !auth.isAuthenticated) {
    await navigateTo(URLS.auth.login)
  }
})
