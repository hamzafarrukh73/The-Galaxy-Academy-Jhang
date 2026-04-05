import { interestsRepository, type Interest } from '~/repository/interestsRepository'
import type { ApiError } from '~/plugins/errors'

export type UIInterest = {
  [K in keyof Interest]: NonNullable<Interest[K]>
}

export const useInterestsStore = defineStore('interestsStore', () => {
  const toast = useToast()
  const { $formatError } = useNuxtApp()

  const interestsFetched = ref(false)
  const interests = ref<Partial<Interest>>({})

  const getInterests = async () => {
    const authStore = useAuthStore()
    if (interestsFetched.value || !authStore.user?.sub) return

    try {
      const data = await interestsRepository.get(authStore.user.sub)
      if (data) {
        interests.value = data as Partial<Interest>
      }
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      interestsFetched.value = true
    }
  }

  const upsertInterests = async () => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()

    if (!authStore.userId) return

    try {
      const data = await interestsRepository.upsert(
        {
          ...interests.value,
          id: authStore.userId
        }
      )

      interests.value = data as Partial<UIInterest>
      toast.add({ title: 'Success', description: 'Interests Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  return {
    interests,
    getInterests,
    upsertInterests
  }
})
