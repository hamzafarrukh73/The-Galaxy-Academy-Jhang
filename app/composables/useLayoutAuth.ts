/**
 * Layout Auth Composable
 * Use in layouts to check auth state and handle protection
 *
 * Usage:
 * const { requireAuth, requireGuest, isLoading } = useLayoutAuth()
 * And wrap protected content with v-if="!requireGuest"
 */
export const useLayoutAuth = () => {
  const auth = useAuthStore()
  const router = useRouter()

  const requireAuth = auth.isAuthenticated
  const requireGuest = !auth.isAuthenticated
  const isLoading = auth.authCheckLoading

  /**
   * Require authentication - redirect if needed
   */
  const enforceAuth = async () => {
    if (!auth.validateSession()) {
      auth.logout()
      await router.push(URLS.auth.login)
      return false
    }
    return true
  }

  /**
   * Require guest - redirect if logged in
   */
  const enforceGuest = async () => {
    if (auth.isAuthenticated) {
      await router.push(URLS.dashboard.home)
      return false
    }
    return true
  }

  return {
    requireAuth,
    requireGuest,
    isLoading,
    enforceAuth,
    enforceGuest,
    user: auth.getUser
  }
}
