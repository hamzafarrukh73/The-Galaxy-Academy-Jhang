import type { Database } from '~/types/database.types'
import { createRepository } from '~/repository/index'

export type NuxtSupabaseClient = ReturnType<typeof useSupabaseClient<Database>>

export default defineNuxtPlugin(() => {
  const client = useSupabaseClient<Database>()
  const repository = createRepository(client)

  const user = useSupabaseUser()
  const session = useSupabaseSession()

  const isAuthenticated = computed(() => !!user.value && !!session.value)

  return {
    provide: {
      api: repository,
      isAuthenticated: isAuthenticated
    }
  }
})
