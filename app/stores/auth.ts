import { authRepository } from '~/repository/authRepository'
import { formatErrorForToast } from '~/plugins/error-handler'
import type { ApiError } from '~/plugins/error-handler'

interface LoginPayload {
  email: string
  password: string
}

interface SignupPayload {
  email: string
  password1: string
  password2: string
  first_name?: string
  last_name?: string
}

export const useAuthStore = defineStore('authStore', () => {
  const toast = useToast()
  const user = useSupabaseUser()
  const session = useSupabaseSession()

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!user.value && !!session.value)

  // --- HELPERS ---
  const handleError = (error: unknown) => {
    toast.add(formatErrorForToast(error as ApiError))
  }

  // --- ACTIONS ---
  const register = async (payload: SignupPayload, redirectUrl?: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.register(payload)
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      handleError(error)
    } finally {
      toast.add({
        title: 'Registration successful',
        description: 'Login to continue.',
        color: 'success'
      })
      useLayoutStore().isLoading = false
    }
  }

  const login = async (payload: LoginPayload, redirectUrl: string = URLS.home) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.login(payload)
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      handleError(error)
    } finally {
      toast.add({ title: 'Welcome back!', color: 'success' })
      useLayoutStore().isLoading = false
    }
  }

  const logout = async (redirectUrl: string = URLS.home) => {
    try {
      await authRepository.logout()
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      toast.add({ title: 'Logged out', color: 'neutral' })
    }
  }

  const resetPassword = async (email: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.resetPassword(email)
      toast.add({ title: 'Reset instructions sent', description: 'Check your email', color: 'success' })
    } catch (error) {
      handleError(error)
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const confirmPasswordReset = async (password: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.confirmPasswordReset(password)
      toast.add({ title: 'Password updated', color: 'success' })
      await navigateTo(URLS.auth.login)
    } catch (error) {
      handleError(error)
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const socialGoogleLogin = async () => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.socialLogin('google')
    } catch (error) {
      handleError(error)
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const resendVerificationEmail = async (email: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.resend({ type: 'signup', email })
      toast.add({ title: 'Verification email sent', color: 'success' })
    } catch (error) {
      handleError(error)
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const verifyEmail = async (token_hash: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.verifyOtp({ token_hash, type: 'signup' })
      toast.add({ title: 'Email verified!', color: 'success' })
      await navigateTo(URLS.home)
    } catch (error) {
      handleError(error)
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  return {
    user,
    isAuthenticated,
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
