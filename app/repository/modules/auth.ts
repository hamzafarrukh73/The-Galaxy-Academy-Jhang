import type { AuthResponse, UserResponse, Session, User } from '@supabase/supabase-js'

import { BaseRepository } from '../base'

export default class AuthRepository extends BaseRepository {
  async register(payload: Parameters<typeof this.client.auth.signUp>[0]) {
    return await this.request(
      this.client.auth.signUp(payload)
    )
  }

  async login(payload: Parameters<typeof this.client.auth.signInWithPassword>[0]) {
    const data = await this.request<AuthResponse['data']>(
      this.client.auth.signInWithPassword(payload)
    )
    return data.user
  }

  async logout() {
    return await this.request<null>(
      this.client.auth.signOut()
    )
  }

  async resetPassword(email: string) {
    const redirectTo = import.meta.client ? `${window.location.origin}${URLS.auth.password.reset}` : ''
    // resetPassword returns { data: {}, error: null } if successful
    return await this.request<unknown>(
      this.client.auth.resetPasswordForEmail(email, { redirectTo })
    )
  }

  async confirmPasswordReset(password: string) {
    const data = await this.request<UserResponse['data']>(
      this.client.auth.updateUser({ password })
    )
    return data.user
  }

  async socialLogin(provider: 'google' | 'github') {
    const redirectTo = import.meta.client ? `${window.location.origin}${URLS.auth.login}` : ''
    // signInWithOAuth returns { provider, url }, not user/session
    return await this.request<{ provider: string, url: string | null }>(
      this.client.auth.signInWithOAuth({
        provider,
        options: { redirectTo }
      })
    )
  }

  /**
   * Session & State
   */
  async getSession() {
    return await this.request<{ session: Session | null }>(
      this.client.auth.getSession()
    )
  }

  onAuthStateChange(callback: (event: string, user: User | null) => void) {
    return this.client.auth.onAuthStateChange((event: string, session: Session | null) => {
      callback(event, session?.user || null)
    })
  }

  async updateUser(attributes: Parameters<typeof this.client.auth.updateUser>[0]) {
    const data = await this.request<UserResponse['data']>(
      this.client.auth.updateUser(attributes)
    )
    return data.user
  }

  async resend(payload: Parameters<typeof this.client.auth.resend>[0]) {
    return await this.request<unknown>(
      this.client.auth.resend(payload)
    )
  }

  async verifyOtp(payload: Parameters<typeof this.client.auth.verifyOtp>[0]) {
    return await this.request<UserResponse['data']>(
      this.client.auth.verifyOtp(payload)
    )
  }
}
