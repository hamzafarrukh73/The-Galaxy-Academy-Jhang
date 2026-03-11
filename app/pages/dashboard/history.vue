<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const authStore = useAuthStore()

const state = reactive({
  studentId: authStore.user?.id?.slice(0, 8).toUpperCase() || 'GA-2024-001',
  currentSchool: '',
  currentClass: '',
  currentGroup: '',
  currentMedium: '',
  prevSchool: '',
  prevClass: '',
  isHafiz: false,
  prevMarksObtained: '',
  prevMarksTotal: '',
  extraInterest: '',
  achievements: '',
  isVolunteer: false
})

const classOptions = [
  '9th Grade', '10th Grade', '11th Grade', '12th Grade'
]

const groupOptions = [
  'Pre-Medical', 'Pre-Engineering', 'ICS (Physics)', 'ICS (Stats)', 'Humanities', 'Commerce'
]

const mediumOptions = [
  'English', 'Urdu'
]

const prevClassOptions = [
  '8th Grade', '9th Grade', '10th Grade', '11th Grade'
]

const interestOptions = [
  'Cricket', 'Football', 'Debating / Speaking', 'Arts / Painting', 'Computer Programming', 'Qira\'at / Naat', 'Other'
]

const onSaveSection = (section: string) => {
  console.log(`Saving ${section}:`, state)
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Academic Information"
      description="Manage your current enrollment and educational background."
      icon="i-lucide-graduation-cap"
    />

    <UPageBody>
      <UPageGrid>
        <!-- Card 1: Current Academic Information -->
        <UPageCard
          title="Current Academic Information"
          icon="i-lucide-graduation-cap"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="Student ID"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <UInput
                  v-model="state.studentId"
                  disabled
                  placeholder="GA-XXXX-XXX"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="School"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <UInput
                  v-model="state.currentSchool"
                  placeholder="Enter Current School Name"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Class"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.currentClass"
                  :items="classOptions"
                  placeholder="Select Class"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Subjects Group"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.currentGroup"
                  :items="groupOptions"
                  placeholder="Select Group"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Medium"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.currentMedium"
                  :items="mediumOptions"
                  placeholder="Select Medium"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Current Info"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('CurrentAcademic')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 2: Previous Education -->
        <UPageCard
          title="Previous Education"
          icon="i-lucide-history"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="School"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <UInput
                  v-model="state.prevSchool"
                  placeholder="Previous School Name"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Class"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.prevClass"
                  :items="prevClassOptions"
                  placeholder="Last Class Completed"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Obtained Marks"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <UInput
                  v-model="state.prevMarksObtained"
                  type="number"
                  placeholder="Marks Obtained"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Total Marks"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <UInput
                  v-model="state.prevMarksTotal"
                  type="number"
                  placeholder="Total Marks"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Hafiz-e-Quran"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USwitch
                  v-model="state.isHafiz"
                  color="primary"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Previous Education"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('PreviousEducation')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 3: Extracurricular & Achievements -->
        <UPageCard
          title="Extracurricular & Achievements"
          icon="i-lucide-trophy"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="Primary Interest"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.extraInterest"
                  :items="interestOptions"
                  placeholder="Select Interest"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Scout / Volunteer"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USwitch
                  v-model="state.isVolunteer"
                  color="primary"
                />
              </UFormField>
              <UFormField
                label="Achievements"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500 self-start pt-2', container: 'flex-1' }"
              >
                <UTextarea
                  v-model="state.achievements"
                  placeholder="List major awards"
                  class="w-full"
                  :rows="2"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Extra Info"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('ExtraInfo')"
              />
            </div>
          </div>
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>

<style scoped>
</style>
