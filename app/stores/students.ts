import type { Students } from '~/repository/modules/students'

import type { ApiError } from '~/plugins/errors'

export const useStudentsStore = defineStore('studentsStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const studentFetched = ref(false)
  const student = ref<Students['Row'] | null>(null)

  const completion = computed(() => {
    const fields = ['school', 'class', 'subject_group'] as const
    const filled = fields.filter(f => !!student.value?.[f]).length
    return {
      filled,
      total: fields.length,
      percentage: Math.round((filled / fields.length) * 100)
    }
  })

  const getStudent = async () => {
    const authStore = useAuthStore()
    if (studentFetched.value || !authStore.userId) return

    try {
      const data = await $api.students.getByUserId(authStore.userId)

      if (data) {
        student.value = data
      }
    } catch (error) {
      console.error('Error fetching student info:', error)
    } finally {
      studentFetched.value = true
    }
  }

  const upsertStudent = async (updates: Students['Update']) => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()

    if (!authStore.userId) return

    try {
      const reqPayload = { ...updates, user_id: authStore.userId }
      if (student.value?.id) reqPayload.id = student.value.id

      const data = await $api.students.upsert(reqPayload as Students['Insert'])

      student.value = data
      toast.add({ title: 'Success', description: 'Student Info Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const clearData = () => {
    student.value = null
    studentFetched.value = false
  }

  return {
    student,
    completion,
    getStudent,
    upsertStudent,
    clearData
  }
})
