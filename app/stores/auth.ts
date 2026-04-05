import { authRepository } from '~/repository/authRepository'
import type { ApiError } from '~/plugins/errors'

interface LoginPayload {
  email: string
  password: string
}

interface SignupPayload {
  email: string
  password1: string
  password2: string
}

export const useAuthStore = defineStore('authStore', () => {
  const toast = useToast()
  const { $formatError } = useNuxtApp()
  const user = useSupabaseUser()
  const session = useSupabaseSession()

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!user.value && !!session.value)
  const userId = computed(() => user.value?.sub)

  // --- ACTIONS ---
  const register = async (payload: SignupPayload, redirectUrl?: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.register(payload)
      toast.add({
        title: 'Registration successful',
        description: 'Login to continue.',
        color: 'success'
      })
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const login = async (payload: LoginPayload, redirectUrl: string = URLS.home) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.login(payload)
      toast.add({ title: 'Welcome back!', color: 'success' })
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const logout = async (redirectUrl: string = URLS.home) => {
    try {
      await authRepository.logout()
      toast.add({ title: 'Logged out', color: 'neutral' })
      if (redirectUrl) setTimeout(() => navigateTo(redirectUrl), 300)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.resetPassword(email)
      toast.add({ title: 'Password Reset', description: 'Check your email for the link', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const confirmPasswordReset = async (password: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.confirmPasswordReset(password)
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
      await authRepository.socialLogin('google')
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const resendVerificationEmail = async (email: string) => {
    useLayoutStore().isLoading = true
    try {
      await authRepository.resend({ type: 'signup', email })
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
      await authRepository.verifyOtp({ token_hash, type: 'signup' })
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
