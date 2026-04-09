import type { Activities } from '~/repository/modules/activities'
import type { ApiError } from '~/plugins/errors'

export const useActivitiesStore = defineStore('activitiesStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const activitiesFetched = ref(false)
  const activities = ref<Activities['Row'] | null>(null)

  const completion = computed(() => {
    const fields = ['career_goal', 'career_motivation', 'hobby', 'role_model'] as const
    const filled = fields.filter(f => !!activities.value?.[f]).length
    return {
      filled,
      total: fields.length,
      percentage: Math.round((filled / fields.length) * 100)
    }
  })

  const fetchPromise = ref<Promise<void> | null>(null)
  const getActivities = async () => {
    const authStore = useAuthStore()
    const studentsStore = useStudentsStore()

    if (activitiesFetched.value || !authStore.userId) return
    if (fetchPromise.value) return fetchPromise.value

    fetchPromise.value = (async () => {
      try {
        if (!studentsStore.student) {
          await studentsStore.getStudent()
        }

        const studentId = studentsStore.student?.id
        if (!studentId) return

        const data = await $api.activities.getByStudentId(studentId)

        if (data) {
          activities.value = data
        }
      } catch (error) {
        toast.add($formatError(error as ApiError))
      } finally {
        activitiesFetched.value = true
        fetchPromise.value = null
      }
    })()

    return fetchPromise.value
  }

  const upsertActivities = async (updates: Activities['Update']) => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()
    const studentsStore = useStudentsStore()

    if (!authStore.userId) return

    try {
      const studentId = studentsStore.student?.id
      if (!studentId) throw new Error('Student Profile must be created first.')

      const reqPayload = {
        ...updates,
        student_id: studentId
      } as Activities['Insert']

      if (activities.value?.id) reqPayload.id = activities.value.id

      const data = await $api.activities.upsert(reqPayload)

      activities.value = data
      toast.add({ title: 'Success', description: 'Activities Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const clearData = () => {
    activities.value = null
    activitiesFetched.value = false
  }

  return {
    activities,
    completion,
    getActivities,
    upsertActivities,
    clearData
  }
})
