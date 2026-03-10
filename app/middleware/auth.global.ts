export default defineNuxtRouteMiddleware(async (to, from) => {
  const toast = useToast()
  const authStore = useAuthStore()

  const pageAuth = to.meta.auth || 'public'
  const requiredRole = to.meta.requiredRole || false
  const userRole = authStore.user?.role || 'anonymous'

  // User is authenticated then block the auth pages
  if (authStore.isAuthenticated && to.path.includes('auth')) {
    return navigateTo(URLS.dashboard.home)
  }

  // If page requires authentication and user still not authenticated, redirect
  if (pageAuth !== 'public' && !authStore.isAuthenticated) {
    toast.add({
      title: 'Authentication Required',
      description: 'Please log in to continue.',
      color: 'error',
      duration: 3000
    })
    return navigateTo(URLS.auth.login)
  }

  // If no required role then pass role check
  if (requiredRole === false) return

  // Check if user has required role
  if (userRole !== requiredRole) {
    toast.add({
      title: 'Access Denied',
      description: 'You do not have the required permission to access this resource.',
      color: 'error',
      duration: 3000
    })
    return navigateTo(from.path)
  }
})
