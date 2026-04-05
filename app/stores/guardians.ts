import type { Guardians } from '~/repository/modules/guardians'

import type { ApiError } from '~/plugins/errors'

export const useGuardianStore = defineStore('guardianStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const guardianFetched = ref(false)
  const guardian = ref<Guardians['Row'] | null>(null)

  const getGuardian = async () => {
    const authStore = useAuthStore()
    if (guardianFetched.value || !authStore.userId) return

    try {
      const data = await $api.guardians.get(authStore.userId)

      if (data) {
        guardian.value = data
      }
    } catch (error) {
      console.error('Error fetching guardian:', error)
    } finally {
      guardianFetched.value = true
    }
  }

  const upsertGuardian = async (updates: Guardians['Update']) => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()

    if (!authStore.userId) return

    try {
      const data = await $api.guardians.upsert(
        {
          ...updates,
          id: authStore.userId
        } as Guardians['Insert']
      )

      guardian.value = data
      toast.add({ title: 'Success', description: 'Guardian Details Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const clearData = () => {
    guardian.value = null
    guardianFetched.value = false
  }

  return {
    guardian,
    getGuardian,
    upsertGuardian,
    clearData
  }
})
