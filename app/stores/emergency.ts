import type { EmergencyContacts } from '~/repository/modules/emergency_contacts'
import type { ApiError } from '~/plugins/errors'

export const useEmergencyStore = defineStore('emergencyStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const contact = ref<EmergencyContacts['Row'] | null>(null)
  const contactFetched = ref(false)

  const completion = computed(() => {
    const fields = ['name', 'phone', 'relationship'] as const
    const filled = fields.filter(f => !!contact.value?.[f]).length
    return {
      filled,
      total: fields.length,
      percentage: Math.round((filled / fields.length) * 100)
    }
  })

  const fetchPromise = ref<Promise<void> | null>(null)
  const getContact = async () => {
    const studentStore = useStudentsStore()
    if (contactFetched.value) return
    if (fetchPromise.value) return fetchPromise.value

    fetchPromise.value = (async () => {
      try {
        if (!studentStore.student) {
          await studentStore.getStudent()
        }

        const studentId = studentStore.student?.id
        if (!studentId) return

        const data = await $api.emergency.getByStudentId(studentId)

        if (data) {
          contact.value = data
        }
      } catch (error) {
        console.error('Error fetching emergency contact:', error)
      } finally {
        contactFetched.value = true
        fetchPromise.value = null
      }
    })()

    return fetchPromise.value
  }

  const upsertContact = async (updates: EmergencyContacts['Update']) => {
    useLayoutStore().isLoading = true
    const studentStore = useStudentsStore()

    if (!studentStore.student?.id) return

    try {
      const reqPayload = { ...updates, student_id: studentStore.student.id }
      if (contact.value?.id) reqPayload.id = contact.value.id

      const data = await $api.emergency.upsert(reqPayload as EmergencyContacts['Insert'])

      contact.value = data
      toast.add({ title: 'Success', description: 'Emergency Contact Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const clearData = () => {
    contact.value = null
    contactFetched.value = false
  }

  return {
    contact,
    completion,
    getContact,
    upsertContact,
    clearData
  }
})
