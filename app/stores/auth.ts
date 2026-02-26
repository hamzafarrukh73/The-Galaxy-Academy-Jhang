import { defineStore } from 'pinia'
import { authRepository } from '~/api/repositories/authRepository'
import { formatErrorForToast, ApiError } from '~/api/errors'

interface User {
  username: string
  role: string
  image_url: string
  is_superuser: boolean
  is_staff: boolean
}

interface Login {
  email: string
  password: string
}

interface Signup {
  email: string
  password1: string
  password2: string
}

export const useAuthStore = defineStore('authStore', () => {
  // --- STATE ---
  const token = useCookie('accessToken')
  const authCheckLoading = ref(false)
  const defaultUser = {
    username: 'Anonymous',
    role: 'Guest',
    image_url: '',
    is_superuser: false,
    is_staff: false
  }
  const user = useCookie<User>('user_data', {
    default: () => (defaultUser),
    watch: true
  })

  // --- Utilities ---
  const toast = useToast()

  // --- HELPERS ---
  /**
   * Decode JWT token to extract payload
   */
  const decodeToken = (jwtToken: string): Record<string, unknown> | null => {
    try {
      const parts = jwtToken.split('.')
      if (parts.length !== 3) return null
      const base64Url = parts[1]
      if (!base64Url) return null
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      )
      return JSON.parse(jsonPayload) as Record<string, unknown>
    } catch {
      return null
    }
  }

  /**
   * Check if JWT token is expired
   */
  const isTokenExpired = (jwtToken: string): boolean => {
    const payload = decodeToken(jwtToken)
    if (!payload || typeof payload.exp !== 'number') {
      return true
    }
    // exp is in seconds, convert to milliseconds
    const expirationTime = payload.exp * 1000
    const currentTime = Date.now()
    // Add 60 second buffer to refresh before expiration
    return currentTime >= expirationTime - 60000
  }

  /**
   * Check if user data is valid (not default user)
   */
  const isUserValid = (): boolean => {
    return user.value && user.value.username !== 'Anonymous'
  }

  // --- GETTERS ---
  const getUser = computed(() => user.value)
  const isAuthenticated = computed(
    () => !!token.value && !isTokenExpired(token.value) && isUserValid()
  )

  // --- ACTIONS ---
  const register = async (payload: Signup, navigate: boolean = false, navigatePath: string = URLS.auth.login) => {
    try {
      await authRepository.register(payload)
      if (navigate) {
        await navigateTo(navigatePath)
      }
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError(String(error), 'UNKNOWN_ERROR')
      const errorInfo = formatErrorForToast(apiError)
      toast.add(errorInfo)
    }
  }

  const login = async (payload: Login, navigate: boolean = false, navigatePath: string = URLS.home) => {
    try {
      const response = await authRepository.login(payload)

      // Update State
      if (response.access) {
        token.value = response.access
        // Note: Backend should set refresh token as httpOnly cookie automatically
        // Map API user response to our User type
        user.value = {
          username: response.user?.email || '',
          role: 'user',
          image_url: '',
          is_superuser: false,
          is_staff: false
        }
      }

      if (navigate) {
        await navigateTo(navigatePath)
      }
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError(String(error), 'UNKNOWN_ERROR')
      const errorInfo = formatErrorForToast(apiError)
      toast.add(errorInfo)
    }
  }

  const logout = (navigate: boolean = false, navigatePath: string = URLS.home) => {
    token.value = null
    user.value = defaultUser

    if (navigate) {
      navigateTo(navigatePath)
    }
  }

  const verifyEmail = async (key: string) => {
    try {
      await authRepository.verifyEmail({ key })
      await navigateTo(URLS.home)
      toast.add({
        title: 'Email verified successfully',
        color: 'success'
      })
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError(String(error), 'UNKNOWN_ERROR')
      const errorInfo = formatErrorForToast(apiError)
      toast.add(errorInfo)
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await authRepository.resendVerificationEmail({ email })
      toast.add({
        title: 'Success',
        description: response.detail || 'Verification email sent',
        color: 'success'
      })
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError(String(error), 'UNKNOWN_ERROR')
      const errorInfo = formatErrorForToast(apiError)
      toast.add(errorInfo)
    }
  }

  /**
   * Validate current session - check if token and user data are in sync
   */
  const validateSession = (): boolean => {
    // If no token, session is invalid
    if (!token.value) {
      return false
    }

    // If token is expired, session is invalid
    if (isTokenExpired(token.value)) {
      logout()
      return false
    }

    // If user is not valid (is default user), session is invalid
    if (!isUserValid()) {
      logout()
      return false
    }

    return true
  }

  /**
   * Restore session on app initialization
   * Validates existing session or clears invalid auth state
   */
  const restoreSession = async (): Promise<boolean> => {
    authCheckLoading.value = true

    try {
      // If no token exists, nothing to restore
      if (!token.value) {
        authCheckLoading.value = false
        return false
      }

      // Check if token is expired
      if (isTokenExpired(token.value)) {
        // Attempt to refresh token using httpOnly cookie
        try {
          const response = await authRepository.refreshToken('')
          // Update access token
          token.value = response.access
          return true
        } catch {
          // Refresh failed, clear auth
          logout()
          return false
        }
      }

      // Validate user data exists and is not default
      if (!isUserValid()) {
        logout()
        return false
      }

      // Session is valid
      return true
    } finally {
      authCheckLoading.value = false
    }
  }

  /**
   * Check if session needs refresh (token near expiration)
   */
  const shouldRefreshToken = (): boolean => {
    if (!token.value) {
      return false
    }

    const payload = decodeToken(token.value)
    if (!payload || typeof payload.exp !== 'number') {
      return false
    }

    // Refresh if token expires in less than 5 minutes
    const expirationTime = payload.exp * 1000
    const currentTime = Date.now()
    const timeToExpiration = expirationTime - currentTime

    return timeToExpiration < 5 * 60 * 1000
  }

  /**
   * Manually refresh access token if near expiration
   */
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const response = await authRepository.refreshToken('')
      token.value = response.access
      return true
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError(String(error), 'UNKNOWN_ERROR')
      const errorInfo = formatErrorForToast(apiError)
      toast.add(errorInfo)
      logout()
      return false
    }
  }

  // --- EXPOSE ---
  // Everything returned here is accessible in components
  return {
    token,
    user,
    authCheckLoading,
    getUser,
    isAuthenticated,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    validateSession,
    restoreSession,
    shouldRefreshToken,
    refreshAccessToken
  }
})
