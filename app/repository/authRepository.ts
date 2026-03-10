/**
 * Auth Repository
 * Identity and authentication logic.
 */
import type { AuthResponse, UserResponse, Session } from '@supabase/supabase-js'
import { mapSupabaseUser } from './userRepository'
import type { User } from './userRepository'

/**
 * Repository
 */
export class AuthRepository {
  /**
   * Internal helpers to access Nuxt app provided services.
   */
  protected get supabase() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (useNuxtApp() as any).$api
  }

  protected get request() {
    return useNuxtApp().$supabaseRequest
  }

  async register(payload: { email: string, password1: string, first_name?: string, last_name?: string }) {
    const { user } = await this.request<AuthResponse['data']>(
      this.supabase.auth.signUp({
        email: payload.email,
        password: payload.password1,
        options: {
          data: {
            first_name: payload.first_name,
            last_name: payload.last_name,
            role: 'user'
          }
        }
      }) as PromiseLike<{ data: AuthResponse['data'], error: unknown }>
    )
    return mapSupabaseUser(user)
  }

  async login(payload: { email: string, password: string }) {
    const { user } = await this.request<AuthResponse['data']>(
      this.supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password
      }) as PromiseLike<{ data: AuthResponse['data'], error: unknown }>
    )
    return mapSupabaseUser(user)
  }

  async logout() {
    await this.request<null>(
      this.supabase.auth.signOut() as unknown as PromiseLike<{ data: null, error: unknown }>
    )
  }

  async resetPassword(email: string) {
    const redirectTo = import.meta.client ? `${window.location.origin}${URLS.auth.password.reset}` : ''
    return await this.request<null>(
      this.supabase.auth.resetPasswordForEmail(email, { redirectTo }) as unknown as PromiseLike<{ data: null, error: unknown }>
    )
  }

  async confirmPasswordReset(password: string) {
    const { user } = await this.request<UserResponse['data']>(
      this.supabase.auth.updateUser({ password }) as unknown as PromiseLike<{ data: UserResponse['data'], error: unknown }>
    )
    return mapSupabaseUser(user)
  }

  async socialLogin(provider: 'google' | 'github') {
    const redirectTo = import.meta.client ? `${window.location.origin}${URLS.auth.login}` : ''
    // signInWithOAuth returns { provider, url }, not user/session
    return await this.request<{ provider: string, url: string | null }>(
      this.supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo }
      }) as unknown as PromiseLike<{ data: { provider: string, url: string | null }, error: unknown }>
    )
  }

  /**
   * Session & State
   */
  async getSession() {
    return await this.request(
      this.supabase.auth.getSession() as PromiseLike<{ data: { session: Session | null }, error: unknown }>
    )
  }

  onAuthStateChange(callback: (event: string, user: User | null) => void) {
    return this.supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      callback(event, mapSupabaseUser(session?.user || null))
    })
  }

  async resend(payload: { email: string, type: 'signup' | 'email_change' }) {
    return await this.request<null>(
      this.supabase.auth.resend(payload) as unknown as PromiseLike<{ data: null, error: unknown }>
    )
  }

  async verifyOtp(payload: { token_hash: string, type: 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'phone_change' }) {
    // Using internal cast to match supabase-js expected types while keeping repository API clean
    const postgrestQuery = this.supabase.auth.verifyOtp(payload as Parameters<typeof this.supabase.auth.verifyOtp>[0])
    return await this.request<UserResponse['data']>(
      postgrestQuery as unknown as PromiseLike<{ data: UserResponse['data'], error: unknown }>
    )
  }
}

export const authRepository = new AuthRepository()
