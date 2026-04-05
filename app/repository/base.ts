import type { NuxtSupabaseClient } from '~/plugins/api'

/**
 * Provides generic CRUD operations using Nuxt Supabase Client.
 */
export class BaseRepository {
  protected client: NuxtSupabaseClient

  constructor(client: NuxtSupabaseClient) {
    this.client = client
  }

  /**
   * Helper to handle Supabase requests and errors
   */
  protected async request<T>(promise: PromiseLike<{ data?: T | null, error?: Error | null }>): Promise<T> {
    const { data, error } = await promise
    if (error) {
      const { $parseError } = useNuxtApp()
      throw $parseError(error)
    }
    return data as T
  }
}
