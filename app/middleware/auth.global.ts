export default defineNuxtRouteMiddleware(async (to, from) => {
  const toast = useToast()
  const { $isAuthenticated } = useNuxtApp()
  const authStore = useAuthStore()

  const pageAuth = to.meta.auth || 'public'
  const requiredRole = to.meta.requiredRole || false
  const userRole = 'anonymous'

  let sessionExists = $isAuthenticated.value

  // Check session validity (checks if expired or fetches on refresh)
  sessionExists = await authStore.verifySession()

  // User is authenticated then block the auth pages
  if (sessionExists && to.path.includes('auth')) {
    return navigateTo(URLS.dashboard.home)
  }

  // If page requires authentication and user still not authenticated, redirect
  if (!sessionExists && pageAuth !== 'public') {
    toast.add({
      title: 'Authentication Error',
      description: `Please log in to continue. Session: ${sessionExists}`,
      color: 'error',
      duration: 3000
    })
    return navigateTo(URLS.auth.login)
  }

  // If no required role then pass role check
  if (!requiredRole) return

  // Check if user has required role
  if (userRole !== requiredRole) {
    toast.add({
      title: 'Authentication Error',
      description: 'Access Denied.',
      color: 'error',
      duration: 3000
    })
    return navigateTo(from.path)
  }
})
