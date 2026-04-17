<script lang="ts" setup>
import type { Tables } from '~/repository'
import type { Activities } from '~/repository/modules/activities'

import {
  currentStudentSchema
} from '~/schemas/dashboard/students'

import {
  activitiesSchema
} from '~/schemas/dashboard/activities'
import { academicSchema } from '~/schemas/dashboard/academic'

definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const studentsStore = useStudentsStore()
const activitiesStore = useActivitiesStore()
const subjectsStore = useSubjectsStore()

const studentState = ref<Tables['students']['Update']>({
  school: '',
  class: undefined,
  subject_group: undefined
})
const activitiesState = ref<Activities['Update']>({
  career_goal: '',
  career_motivation: '',
  hobby: '',
  is_hafiz: false
})
const ratingsState = ref<{ subject_ranking: { subject_id: string, name: string, rating: number }[] }>({
  subject_ranking: []
})
const academicState = ref<Tables['academic_backgrounds']['Update']>({
  last_class: undefined,
  school: '',
  marks_percent: undefined,
  passing_year: ''
})

const loadData = async () => {
  await Promise.all([
    studentsStore.getStudent(),
    activitiesStore.getActivities(),
    subjectsStore.getSubjects(),
    subjectsStore.getRatings(),
    studentsStore.getAcademicBackground()
  ])

  studentState.value = { ...studentState.value, ...studentsStore.student }
  activitiesState.value = { ...activitiesState.value, ...activitiesStore.activities }
  academicState.value = { ...academicState.value, ...studentsStore.academicBackground }

  const dbSubjects = subjectsStore.subjects
  const dbRatings = subjectsStore.ratings

  ratingsState.value.subject_ranking = dbSubjects.map((subject) => {
    const ratingRec = dbRatings.find(r => r.subject_id === subject.id)
    return {
      subject_id: subject.id,
      name: subject.name,
      rating: ratingRec?.rating ? Number(ratingRec.rating) : 3
    }
  })
}

onMounted(() => {
  loadData()
})

const onSaveStudent = async () => {
  await studentsStore.upsertStudent(studentState.value)
}

const onSaveActivities = async () => {
  await activitiesStore.upsertActivities(activitiesState.value)
}

const onSaveAcademic = async () => {
  await studentsStore.upsertAcademicBackground(academicState.value)
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Student Details"
      description="Manage your academic profile and learning goals."
      :icon="ICONS.nav.education"
    />

    <UPageBody>
      <UPageGrid>
        <!-- Card 1: Academic Info -->
        <UPageCard
          title="Academic Profile"
          :icon="ICONS.nav.education"
          class="h-full lg:col-span-1"
        >
          <AppForm
            :state="studentState"
            :schema="currentStudentSchema"
            grid-class="grid grid-cols-1 gap-4"
            submit-label="Save Info"
            @submit="onSaveStudent"
          />
        </UPageCard>

        <!-- Card 2: Interests & Goals -->
        <UPageCard
          title="Interests & Goals"
          :icon="ICONS.info.trophy"
          class="h-full lg:col-span-2"
        >
          <AppForm
            :state="activitiesState"
            :schema="activitiesSchema"
            grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
            submit-label="Save Activities"
            @submit="onSaveActivities"
          />
        </UPageCard>

        <!-- Card 3: Academic Background -->
        <UPageCard
          title="Academic Background"
          description="Provide details of your last completed academic level."
          :icon="ICONS.nav.education"
          class="lg:col-span-3"
        >
          <AppForm
            :state="academicState"
            :schema="academicSchema"
            grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
            submit-label="Save Academic Background"
            @submit="onSaveAcademic"
          />
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>
