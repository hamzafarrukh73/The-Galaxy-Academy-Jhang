import type { Database } from '~/types/database.types'

export default defineNuxtPlugin(() => {
  const api = useSupabaseClient<Database>()

  const supabaseRequest = async <T>(promise: PromiseLike<{ data?: T | null, error: unknown }>): Promise<T> => {
    const result = await promise
    if (result.error) {
      const { $parseError } = useNuxtApp()
      throw $parseError(result.error)
    }
    return result.data as T
  }

  return {
    provide: {
      api,
      supabaseRequest
    }
  }
})
