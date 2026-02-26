/**
 * Authentication Repository
 * Handles all auth-related API calls
 * Auto-generated types from OpenAPI schema integrated with BaseRepository
 */

import { apiRequest } from '../client'
import type { components } from '../types'

type LoginPayload = Omit<components['schemas']['Login'], 'access' | 'refresh' | 'access_expiration' | 'refresh_expiration' | 'user'>
type LoginResponse = components['schemas']['Login']

type RegisterPayload = Omit<components['schemas']['Register'], 'detail'>
type RegisterResponse = components['schemas']['Register']

type VerifyEmailPayload = Omit<components['schemas']['VerifyEmail'], 'detail'>
type VerifyEmailResponse = components['schemas']['VerifyEmail']

type ResendEmailPayload = Omit<components['schemas']['ResendEmailVerification'], 'detail'>
type ResendEmailResponse = components['schemas']['ResendEmailVerification']

type UserResponse = components['schemas']['User']

type TokenRefreshResponse = components['schemas']['CookieTokenRefresh']

/**
 * Auth repository with custom methods for auth-specific endpoints
 * Demonstrates how to extend BaseRepository with OpenAPI types
 */
export const authRepository = {
  /**
   * User registration
   */
  async register(payload: RegisterPayload) {
    return apiRequest<RegisterResponse>(
      '/auth/registration/',
      {
        method: 'POST',
        body: payload
      }
    )
  },

  /**
   * User login
   */
  async login(payload: LoginPayload) {
    return apiRequest<LoginResponse>(
      '/auth/login/',
      {
        method: 'POST',
        body: payload
      }
    )
  },

  /**
   * Verify email with token
   */
  async verifyEmail(payload: VerifyEmailPayload) {
    return apiRequest<VerifyEmailResponse>(
      '/auth/registration/verify-email/',
      {
        method: 'POST',
        body: payload
      }
    )
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(payload: ResendEmailPayload) {
    return apiRequest<ResendEmailResponse>(
      '/auth/registration/resend-email/',
      {
        method: 'POST',
        body: payload
      }
    )
  },

  /**
   * Get current user info
   */
  async getCurrentUser() {
    return apiRequest<UserResponse>(
      '/auth/user/',
      {
        method: 'GET'
      }
    )
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    return apiRequest<TokenRefreshResponse>(
      '/auth/token/refresh/',
      {
        method: 'POST',
        body: { refresh: refreshToken }
      }
    )
  }
}
