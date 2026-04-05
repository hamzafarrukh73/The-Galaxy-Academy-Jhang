<script lang="ts" setup>
import {
  currentAcademicSchema,
  extraAcademicSchema
} from '~/schemas/dashboard/academic'

import {
  aspirationsSchema,
  hobbySchema,
  discoverySchema,
  subjectLikingSchema
} from '~/schemas/dashboard/interests'

definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const academicStore = useAcademicStore()
const interestsStore = useInterestsStore()

const loadData = async () => {
  await Promise.all([
    academicStore.getAcademic(),
    interestsStore.getInterests()
  ])

  // Initialize subject_ranking if it doesn't exist
  if (!interestsStore.interests.subject_ranking || interestsStore.interests.subject_ranking.length === 0) {
    interestsStore.interests.subject_ranking = [
      { name: 'Mathematics', liking: 3 },
      { name: 'Physics', liking: 3 },
      { name: 'Chemistry', liking: 3 },
      { name: 'Biology', liking: 3 },
      { name: 'Computer Science', liking: 3 },
      { name: 'English', liking: 3 },
      { name: 'Urdu', liking: 3 },
      { name: 'Islamiyat', liking: 3 },
      { name: 'Pakistan Studies', liking: 3 }
    ]
  }
}

onMounted(() => {
  loadData()
})

const onSaveAcademic = async () => {
  await academicStore.upsertAcademic()
}

const onSaveInterests = async () => {
  await interestsStore.upsertInterests()
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Academic Records & Interests"
      description="Manage your enrollment, educational background, and learning goals."
      :icon="ICONS.nav.education"
    />

    <UPageBody>
      <UPageGrid>
        <!-- Card 1: Current Academic Information -->
        <UPageCard
          title="Current Enrollment"
          :icon="ICONS.nav.education"
          class="h-full lg:col-span-2"
        >
          <AppForm
            :state="academicStore.academic"
            :schema="currentAcademicSchema"
            submit-label="Save"
            @submit="onSaveAcademic"
          />
        </UPageCard>

        <!-- Card 2: Extracurricular & Achievements -->
        <UPageCard
          :icon="ICONS.info.trophy"
          class="h-full lg:col-span-1"
        >
          <AppForm
            :state="academicStore.academic"
            :schema="extraAcademicSchema"
            grid-class="grid grid-cols-1 gap-4"
            submit-label="Save Achievements"
            @submit="onSaveAcademic"
          />
        </UPageCard>

        <!-- Card 3: Future Aspirations -->
        <UPageCard
          :icon="ICONS.action.start"
          class="h-full"
        >
          <AppForm
            :state="interestsStore.interests"
            :schema="aspirationsSchema"
            grid-class="grid grid-cols-1 gap-4"
            submit-label="Save Aspirations"
            @submit="onSaveInterests"
          />
        </UPageCard>

        <!-- Card 4: Hobbies & Passions -->
        <UPageCard
          :icon="ICONS.action.heart"
          class="h-full"
        >
          <AppForm
            :state="interestsStore.interests"
            :schema="hobbySchema"
            grid-class="grid grid-cols-1 gap-4"
            submit-label="Save Hobby"
            @submit="onSaveInterests"
          />
        </UPageCard>

        <!-- Card 5: Discovery -->
        <UPageCard
          :icon="ICONS.info.help"
          class="h-full"
        >
          <AppForm
            :state="interestsStore.interests"
            :schema="discoverySchema"
            grid-class="grid grid-cols-1 gap-4"
            submit-label="Save Discovery"
            @submit="onSaveInterests"
          />
        </UPageCard>

        <!-- Card 7: Subject Liking (was interests.vue Card 4) -->
        <UPageCard
          title="Subject Preference"
          description="Rate your interest in each subject from 1 (Least Liked) to 5 (Most Liked). This helps us tailor your learning experience."
          :icon="ICONS.nav.interests"
          class="lg:col-span-3"
        >
          <AppForm
            :state="interestsStore.interests"
            :schema="subjectLikingSchema"
            submit-label="Save Preferences"
            @submit="onSaveInterests"
          >
            <template #field-subject_ranking>
              <div class="space-y-8 w-full px-1">
                <div
                  v-for="subject in interestsStore.interests.subject_ranking"
                  :key="subject.name"
                  class="flex flex-col gap-2"
                >
                  <div class="flex justify-between items-center px-1">
                    <span class="text-zinc-500 font-medium">{{ subject.name }}</span>
                    <span
                      class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500"
                    >
                      {{ ['Not at all', 'Dislike', 'Neutral', 'Like', 'Love'][subject.liking - 1] }}
                    </span>
                  </div>
                  <USlider
                    v-model="subject.liking"
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
