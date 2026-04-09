import type { Tables } from '~/repository/index'
import type { ApiError } from '~/plugins/errors'

export const useSubjectsStore = defineStore('subjectsStore', () => {
  const toast = useToast()
  const { $formatError, $api } = useNuxtApp()

  const subjects = ref<Tables['subjects']['Row'][]>([])
  const subjectsFetched = ref(false)

  const ratings = ref<Tables['subjects_ratings']['Row'][]>([])
  const ratingsFetched = ref(false)

  const completion = computed(() => {
    const total = subjects.value.length || 1
    const filled = ratings.value.length
    return {
      filled,
      total,
      percentage: Math.round((filled / total) * 100)
    }
  })

  const subjectsPromise = ref<Promise<void> | null>(null)
  const getSubjects = async () => {
    if (subjectsFetched.value) return
    if (subjectsPromise.value) return subjectsPromise.value

    subjectsPromise.value = (async () => {
      try {
        const data = await $api.subjects.list()
        if (data) {
          subjects.value = data as Tables['subjects']['Row'][]
        }
      } catch (error) {
        toast.add($formatError(error as ApiError))
      } finally {
        subjectsFetched.value = true
        subjectsPromise.value = null
      }
    })()

    return subjectsPromise.value
  }

  const ratingsPromise = ref<Promise<void> | null>(null)
  const getRatings = async () => {
    const studentsStore = useStudentsStore()
    if (ratingsFetched.value) return
    if (ratingsPromise.value) return ratingsPromise.value

    ratingsPromise.value = (async () => {
      try {
        if (!studentsStore.student) await studentsStore.getStudent()
        const studentId = studentsStore.student?.id
        if (!studentId) return

        const data = await $api.subject_ratings.list({
          filters: { student_id: studentId }
        })

        if (data) {
          ratings.value = data as Tables['subjects_ratings']['Row'][]
        }
      } catch (error) {
        toast.add($formatError(error as ApiError))
      } finally {
        ratingsFetched.value = true
        ratingsPromise.value = null
      }
    })()

    return ratingsPromise.value
  }

  const upsertRatings = async (updates: { subject_id: string, rating: number }[]) => {
    useLayoutStore().isLoading = true
    const studentsStore = useStudentsStore()

    try {
      const studentId = studentsStore.student?.id
      if (!studentId) throw new Error('Student Profile must be created first.')

      // Map to database payload
      const payloads = updates.map((u) => {
        const payload: Tables['subjects_ratings']['Insert'] = {
          student_id: studentId,
          subject_id: u.subject_id,
          rating: u.rating.toString() as Tables['subjects_ratings']['Row']['rating']
        }

        return {
          ...payload
        }
      })

      const options = {
        onConflict: 'student_id, subject_id'
      }
      const data = await $api.subject_ratings.upsertMany(payloads, options)
      if (data) {
        ratings.value = data as Tables['subjects_ratings']['Row'][]
        toast.add({ title: 'Success', description: 'Subject Ratings Updated', color: 'success' })
      }
    } catch (error) {
      toast.add($formatError(error as ApiError))
    } finally {
      useLayoutStore().isLoading = false
    }
  }

  const clearData = () => {
    subjects.value = []
    subjectsFetched.value = false
    ratings.value = []
    ratingsFetched.value = false
  }

  return {
    subjects,
    ratings,
    completion,
    getSubjects,
    getRatings,
    upsertRatings,
    clearData
  }
})
