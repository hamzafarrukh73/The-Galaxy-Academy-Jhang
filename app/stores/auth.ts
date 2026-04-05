import type { ApiError } from '~/plugins/errors'

export const useAuthStore = defineStore('authStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const user = useSupabaseUser()
  const session = useSupabaseSession()

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!user.value && !!session.value)
  const userId = computed(() => user.value?.sub)

  // --- ACTIONS ---
  const verifySession = async () => {
    const client = useSupabaseClient()
    const { data, error } = await client.auth.getSession()
    if (error || !data.session) {
      return false
    }
    return true
  }

  const register = async (payload: Parameters<typeof $api.auth.register>[0], redirectUrl?: string) => {
    useLayoutStore().isLoading = true
    try {
      await $api.auth.register(payload)

      toast.add({
        title: 'Auth',
        description: 'Registration Successful!',
        color: 'success'
      })
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const login = async (payload: Parameters<typeof $api.auth.login>[0], redirectUrl: string = URLS.home) => {
    useLayoutStore().isLoading = true
    try {
      await $api.auth.login(payload)

      toast.add({
        title: 'Auth',
        description: 'Login Successful!',
        color: 'success'
      })
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const logout = async (redirectUrl: string = URLS.home) => {
    try {
      await $api.auth.logout()

      // Clear all global stores
      useUsersStore().clearData()
      useStudentsStore().clearData()
      useGuardianStore().clearData()
      useActivitiesStore().clearData()

      toast.add({ title: 'Logged out', color: 'neutral' })
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    useLayoutStore().isLoading = true
    try {
      await $api.auth.resetPassword(email)

      toast.add({ title: 'Auth', description: 'Check your email for the link', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const confirmPasswordReset = async (password: string) => {
    useLayoutStore().isLoading = true
    try {
      await $api.auth.confirmPasswordReset(password)

      toast.add({ title: 'Password Reset', description: 'Password reset successfully', color: 'success' })

      await navigateTo(URLS.auth.login)
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const socialGoogleLogin = async () => {
    useLayoutStore().isLoading = true
    try {
      await $api.auth.socialLogin('google')
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const resendVerificationEmail = async (email: string) => {
    useLayoutStore().isLoading = true
    try {
      await $api.auth.resend({ type: 'signup', email })

      toast.add({ title: 'Email Verification', description: 'Verification email sent', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const verifyEmail = async (token_hash: string) => {
    useLayoutStore().isLoading = true
    try {
      await $api.auth.verifyOtp({ token_hash, type: 'signup' })

      toast.add({ title: 'Email Verification', description: 'Email verified!', color: 'success' })
      await navigateTo(URLS.home)
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  return {
    user,
    userId,
    isAuthenticated,
    verifySession,
    login,
    register,
    logout,
    resetPassword,
    confirmPasswordReset,
    socialGoogleLogin,
    resendVerificationEmail,
    verifyEmail
  }
})
