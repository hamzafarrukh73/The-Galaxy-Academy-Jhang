import { academicRepository, type Academic } from '~/repository/academicRepository'
import type { ApiError } from '~/plugins/errors'

export type UIAcademic = {
  [K in keyof Academic]: NonNullable<Academic[K]>
}

export const useAcademicStore = defineStore('academicStore', () => {
  const toast = useToast()
  const { $formatError } = useNuxtApp()

  const academicFetched = ref(false)
  const academic = ref<Partial<UIAcademic>>({
    student_id: '',
    current_school: '',
    current_class: '',
    current_group: '',
    current_medium: '',
    prev_school: '',
    prev_class: '',
    prev_marks_obtained: undefined,
    prev_marks_total: undefined,
    is_hafiz: false,
    extra_interest: '',
    is_volunteer: false,
    achievements: ''
  })

  const getAcademic = async () => {
    const authStore = useAuthStore()
    if (academicFetched.value || !authStore.user?.sub) return

    try {
      const data = await academicRepository.get(authStore.user.sub)
      if (data) {
        academic.value = data as Partial<UIAcademic>
      }
    } catch (error) {
      console.error('Error fetching academic info:', error)
    } finally {
      academicFetched.value = true
    }
  }

  const upsertAcademic = async () => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()

    if (!authStore.userId) return

    try {
      const data = await academicRepository.upsert(
        {
          ...academic.value,
          id: authStore.userId,
          student_id: academic.value.student_id || authStore.userId.slice(0, 8).toUpperCase()
        } as Academic
      )

      academic.value = data as Partial<UIAcademic>
      toast.add({ title: 'Success', description: 'Academic Info Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  return {
    academic,
    getAcademic,
    upsertAcademic
  }
})
