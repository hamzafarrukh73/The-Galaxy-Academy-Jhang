import type { Tables } from '~/repository'
import type { Students } from '~/repository/modules/students'

import type { ApiError } from '~/plugins/errors'

export const useStudentsStore = defineStore('studentsStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const studentFetched = ref(false)
  const student = ref<Students['Row'] | null>(null)
  const academicBackground = ref<Tables['academic_backgrounds']['Row'] | null>(null)
  const academicFetched = ref(false)

  const completion = computed(() => {
    const studentFields = ['school', 'class', 'subject_group'] as const
    const academicFields = ['last_class', 'school', 'marks_percent', 'passing_year'] as const

    const studentFilled = studentFields.filter(f => !!student.value?.[f]).length
    const academicFilled = academicFields.filter(f => !!academicBackground.value?.[f]).length

    const filled = studentFilled + academicFilled
    const total = studentFields.length + academicFields.length

    return {
      filled,
      total,
      percentage: total > 0 ? Math.round((filled / total) * 100) : 0
    }
  })

  const fetchPromise = ref<Promise<void> | null>(null)
  const getStudent = async () => {
    const authStore = useAuthStore()
    if (studentFetched.value || !authStore.userId) return

    if (fetchPromise.value) return fetchPromise.value

    fetchPromise.value = (async () => {
      try {
        const userId = authStore.userId
        if (!userId) return

        const data = await $api.students.getByUserId(userId)
        if (data) {
          student.value = data
        }
      } catch (error) {
        console.error('Error fetching student info:', error)
      } finally {
        studentFetched.value = true
        fetchPromise.value = null
      }
    })()

    return fetchPromise.value
  }

  const academicPromise = ref<Promise<void> | null>(null)
  const getAcademicBackground = async () => {
    const authStore = useAuthStore()
    if (academicFetched.value || !authStore.userId) return

    if (academicPromise.value) return academicPromise.value

    academicPromise.value = (async () => {
      try {
        if (!student.value) {
          await getStudent()
        }
        if (student.value?.id) {
          const data = await $api.academic.getOne('student_id', student.value.id)
          academicBackground.value = data
        }
      } catch (error) {
        console.error('Error fetching academic background:', error)
      } finally {
        academicFetched.value = true
        academicPromise.value = null
      }
    })()

    return academicPromise.value
  }

  const generateDisplayId = (currentClass: string | undefined): string => {
    if (!currentClass) return ''

    const yearCode = `B${new Date().getFullYear().toString().slice(-2)}`
    const match = currentClass.match(/\d+/)
    const classNumValue = match ? parseInt(match[0]) : 0
    const classCode = classNumValue.toString().padStart(2, '0')

    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hour = now.getHours()

    // Formula: 100 - (month + day + hour - classNumValue)
    const formulaResult = 100 - (month + day + hour - classNumValue)
    const seq = formulaResult.toString().padStart(2, '0')

    return `GA-${yearCode}-${classCode}-${seq}`
  }

  const upsertStudent = async (updates: Students['Update']) => {
    useLayoutStore().isLoading = true
    const authStore = useAuthStore()

    const userId = authStore.userId
    if (!userId) return

    try {
      const reqPayload = { ...updates, user_id: userId } as Record<string, unknown>
      if (student.value?.id) reqPayload.id = student.value.id

      // Generate display_id if it doesn't exist or is corrupt
      const idCorrupt = !student.value?.display_id || !/^GA-B\d{2}-\d{2}-\d{2,}$/.test(student.value.display_id)
      const targetClass = (updates.class || student.value?.class) as string | undefined

      if (idCorrupt && targetClass) {
        reqPayload.display_id = generateDisplayId(targetClass)
      }

      const data = await $api.students.upsert(reqPayload as Students['Insert'])

      student.value = data
      toast.add({ title: 'Success', description: 'Student Info Updated', color: 'success' })
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const upsertAcademicBackground = async (updates: Tables['academic_backgrounds']['Update']) => {
    useLayoutStore().isLoading = true
    try {
      if (!student.value) {
        await getStudent()
      }
      if (!student.value?.id) return

      const reqPayload = { ...updates, student_id: student.value.id }
      if (academicBackground.value?.id) reqPayload.id = academicBackground.value.id

      const data = await $api.academic.upsert(reqPayload as Tables['academic_backgrounds']['Insert'])
      academicBackground.value = data
      toast.add({ title: 'Success', description: 'Academic Background Updated', color: 'success' })
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
    academicBackground,
    completion,
    getStudent,
    getAcademicBackground,
    upsertStudent,
    upsertAcademicBackground,
    clearData
  }
})
