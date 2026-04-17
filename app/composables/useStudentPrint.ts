import type { Tables } from '~/repository'

export const useStudentPrint = () => {
  const authStore = useAuthStore()
  const usersStore = useUsersStore()
  const studentsStore = useStudentsStore()
  const activitiesStore = useActivitiesStore()
  const subjectsStore = useSubjectsStore()
  const emergencyStore = useEmergencyStore()

  const isLoading = ref(true)

  const prepareData = async () => {
    isLoading.value = true
    try {
      await Promise.allSettled([
        usersStore.getUser(),
        studentsStore.getStudent(),
        activitiesStore.getActivities(),
        emergencyStore.getContact(),
        subjectsStore.getSubjects(),
        subjectsStore.getRatings(),
        studentsStore.getAcademicBackground()
      ])
    } finally {
      isLoading.value = false
    }
  }

  const fullName = computed(() => {
    const p = usersStore.user
    return `${p?.first_name || ''} ${p?.last_name || ''}`.trim() || 'Student Name'
  })

  const studentId = computed(() => studentsStore.student?.display_id || 'PENDING')

  const formatDate = (date: string | null | undefined) =>
    date ? new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'

  const classGroup = computed(() => {
    const c = studentsStore.student?.class
    if (c === '9th' || c === '10th') return 'Matric'
    if (c === '11th' || c === '12th') return 'Intermediate'
    return 'N/A'
  })

  const activityData = computed(() => {
    const i = activitiesStore.activities
    return {
      aspiration: String(i?.career_goal || 'N/A'),
      motivation: String(i?.career_motivation || 'N/A'),
      hobby: String(i?.hobby || 'N/A'),
      is_hafiz: i?.is_hafiz ? 'Yes' : 'No'
    }
  })

  const subjectScores = computed(() => {
    const student = studentsStore.student
    if (!student) return []

    const baseSubjects = subjectsStore.subjects.length > 0
      ? subjectsStore.subjects.map(s => ({ id: s.id, name: s.name }))
      : [
          { id: '1', name: 'Mathematics' },
          { id: '2', name: 'Physics' },
          { id: '3', name: 'Chemistry' },
          { id: '4', name: 'Computer Science' },
          { id: '5', name: 'English' },
          { id: '6', name: 'Urdu' }
        ]

    const studentRatings = subjectsStore.ratings.filter((r: Tables['subjects_ratings']['Row']) => r.student_id === student.id)

    return baseSubjects.map((s: { id: string, name: string }) => {
      const rating = studentRatings.find((r: Tables['subjects_ratings']['Row']) => r.subject_id === s.id)
      return {
        name: s.name,
        rating: rating?.rating ? Number(rating.rating) : 3
      }
    }).sort((a: { rating: number }, b: { rating: number }) => b.rating - a.rating)
  })

  const academicBackground = computed(() => {
    const a = studentsStore.academicBackground
    return {
      school: a?.school || 'N/A',
      lastClass: a?.last_class || 'N/A',
      marksPercent: a?.marks_percent ? `${a.marks_percent}%` : 'N/A',
      passingYear: a?.passing_year || 'N/A'
    }
  })

  return {
    isLoading,
    prepareData,
    fullName,
    studentId,
    formatDate,
    classGroup,
    activityData,
    subjectScores,
    academicBackground,
    authStore,
    usersStore,
    studentsStore,
    emergencyStore
  }
}
