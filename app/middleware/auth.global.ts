export default defineNuxtRouteMiddleware(async (to, _from) => {
  const auth = useAuthStore()
  const pageAuth = to.meta.auth || 'public'
  const requiredRole = to.meta.requiredRole || 'guest'
  const userRole = auth.user.role || 'guest'

  const toast = useToast()

  // Validate current session - check token validity and user data consistency
  if (!auth.validateSession()) {
    // Session is invalid, clear any remaining auth data
    auth.logout()

    // If page requires authentication, redirect and show error
    if (pageAuth !== 'public') {
      toast.add({
        title: 'Session Expired',
        description: 'Please log in again to continue.',
        color: 'error',
        duration: 5000
      })
      return navigateTo(URLS.auth.login)
    }
  }

  // Check if user is authenticated when page requires it
  if (pageAuth !== 'public' && !auth.isAuthenticated) {
    toast.add({
      title: 'Unauthenticated',
      description: 'Please log in to access this page.',
      color: 'error',
      duration: 5000
    })
    return navigateTo(URLS.auth.login)
  }

  // Check if user has required role
  if (pageAuth === 'private' && auth.isAuthenticated && userRole !== requiredRole) {
    toast.add({
      title: 'Unauthorized',
      description: 'You do not have the required permission to access this page.',
      color: 'error',
      duration: 5000
    })
    return navigateTo(URLS.home)
  }
})
