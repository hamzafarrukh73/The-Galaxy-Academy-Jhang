import { guardianRepository, type Guardian } from '~/repository/guardianRepository'
import type { ApiError } from '~/plugins/errors'

export const useGuardianStore = defineStore('guardianStore', () => {
  const toast = useToast()
  const { $formatError } = useNuxtApp()

  const guardianFetched = ref(false)
  const guardian = ref<Partial<Guardian>>({
    name: '',
    relationship: '',
    cnic: '',
    email: '',
    phone: '',
    is_whatsapp: false,
    emergency_name: '',
    emergency_phone: '',
    emergency_relationship: ''
  })

  const getGuardian = async () => {
    const authStore = useAuthStore()
    if (guardianFetched.value || !authStore.user?.sub) return

    try {
      const data = await guardianRepository.findOne(authStore.user.sub)
      if (data) {
        guardian.value = { ...guardian.value, ...data }
      }
    } catch (error) {
      console.error('Error fetching guardian:', error)
    } finally {
      guardianFetched.value = true
    }
  }

  const upsertGuardian = async () => {
    const layoutStore = useLayoutStore()
    layoutStore.isLoading = true
    const authStore = useAuthStore()

    if (!authStore.userId) return

    try {
      const data = await guardianRepository.upsert(
        {
          ...guardian.value,
          id: authStore.userId
        }
      )

      guardian.value = { ...guardian.value, ...data }
      toast.add({ title: 'Success', description: 'Guardian Details Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      layoutStore.isLoading = false
    }
  }

  return {
    guardian,
    getGuardian,
    upsertGuardian
  }
})
