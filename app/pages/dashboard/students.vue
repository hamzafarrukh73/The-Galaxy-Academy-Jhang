<script lang="ts" setup>
import type { Students } from '~/repository/modules/students'
import type { Activities } from '~/repository/modules/activities'

import {
  currentStudentSchema
} from '~/schemas/dashboard/students'

import {
  activitiesSchema,
  subjectRatingSchema
} from '~/schemas/dashboard/activities'

definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const studentsStore = useStudentsStore()
const activitiesStore = useActivitiesStore()
const subjectsStore = useSubjectsStore()

const studentState = ref<Students['Update']>({
  school: '',
  class: undefined,
  subject_group: undefined
})
const activitiesState = ref<Activities['Update']>({
  career_goal: '',
  career_motivation: '',
  hobby: '',
  role_model: '',
  is_hafiz: false,
  want_job: false
})
const ratingsState = ref<{ subject_ranking: { subject_id: string, name: string, rating: number }[] }>({
  subject_ranking: []
})

const loadData = async () => {
  await Promise.all([
    studentsStore.getStudent(),
    activitiesStore.getActivities(),
    subjectsStore.getSubjects(),
    subjectsStore.getRatings()
  ])

  studentState.value = { ...studentState.value, ...studentsStore.student }
  activitiesState.value = { ...activitiesState.value, ...activitiesStore.activities }

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

const onSaveRatings = async () => {
  await subjectsStore.upsertRatings(ratingsState.value.subject_ranking)
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

        <!-- Card 3: Subject Ratings -->
        <UPageCard
          title="Subject Preference"
          description="Rate your interest in each subject from 1 (Least Liked) to 5 (Most Liked). This helps us tailor your learning experience."
          :icon="ICONS.nav.interests"
          class="lg:col-span-3"
        >
          <AppForm
            :state="ratingsState"
            :schema="subjectRatingSchema"
            submit-label="Save Ratings"
            @submit="onSaveRatings"
          >
            <template #field-subject_ranking>
              <div class="space-y-8 w-full px-1">
                <div
                  v-for="subject in ratingsState.subject_ranking"
                  :key="subject.name"
                  class="flex flex-col gap-2"
                >
                  <div class="flex justify-between items-center px-1">
                    <span class="text-zinc-500 font-medium">{{ subject.name }}</span>
                    <span
                      class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500"
                    >
                      {{ ['Not at all', 'Dislike', 'Neutral', 'Like', 'Love'][subject.rating - 1] }}
                    </span>
                  </div>
                  <USlider
                    v-model="subject.rating"
                    :min="1"
                    :max="5"
                    :step="1"
                    size="lg"
                    class="w-full"
                  />
                </div>
              </div>
            </template>
          </AppForm>
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>
