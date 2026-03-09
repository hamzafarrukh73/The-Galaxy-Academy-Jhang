/**
 * User Repository
 */
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { BaseRepository } from './baseRepository'

export interface User {
  id: string
  email: string
  username: string
  avatarUrl: string
  role: string
}

/**
 * Mappers
 */
export const mapSupabaseUser = (sbUser: SupabaseUser | null): User | null => {
  if (!sbUser) return null
  const meta = sbUser.user_metadata || {}
  return {
    id: sbUser.id,
    email: sbUser.email || '',
    username: String(meta.username || sbUser.email?.split('@')[0] || 'User'),
    avatarUrl: String(meta.avatar_url || ''),
    role: String(sbUser.app_metadata?.role || 'user')
  }
}

export class UserRepository extends BaseRepository<'profiles', User> {
  constructor() {
    // Current database doesn't have a public.profiles table yet
    // Using dummy 'profiles' as fallback
    super('profiles')
  }

  /**
   * Get the current authenticated user
   */
  async getMe(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    return mapSupabaseUser(user)
  }

  /**
   * Update user profile metadata
   */
  async updateProfile(updates: Record<string, unknown>) {
    const { data: { user } } = await this.supabase.auth.updateUser({
      data: updates
    })
    return mapSupabaseUser(user)
  }
}

export const userRepository = new UserRepository()
