<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
  auth: 'private',
  navGroup: 'dashboard'
})

// Stores
const usersStore = useUsersStore()
const studentsStore = useStudentsStore()
const activitiesStore = useActivitiesStore()
const emergencyStore = useEmergencyStore()
const subjectsStore = useSubjectsStore()

// Data fetching
onMounted(async () => {
  await Promise.all([
    usersStore.getUser(),
    studentsStore.getStudent(),
    activitiesStore.getActivities(),
    emergencyStore.getContact(),
    subjectsStore.getSubjects(),
    subjectsStore.getRatings()
  ])
})

// Profile completion calculation
const profileCompletion = computed<number>(() => {
  const stores = [
    usersStore,
    studentsStore,
    activitiesStore,
    emergencyStore,
    subjectsStore
  ]

  const totalFilled = stores.reduce((acc, s) => acc + s.completion.filled, 0)
  const totalFields = stores.reduce((acc, s) => acc + s.completion.total, 0)

  return totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0
})

const printProfileRef = ref<{ printProfile: () => void } | null>(null)

const downloadPdf = () => {
  printProfileRef.value?.printProfile()
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Profile Completion"
      :icon="ICONS.info.stats"
    >
      <div class="flex gap-8 mt-8">
        <UProgress
          v-model="profileCompletion"
          status
          color="primary"
          class="rounded-full"
        />
        <UButton
          label="Download"
          :icon="ICONS.action.download"
          size="xl"
          color="primary"
          variant="solid"
          class="rounded-xl hover:cursor-pointer"
          :disabled="profileCompletion < 100"
          @click="downloadPdf"
        />
      </div>
      <p
        v-if="profileCompletion < 100"
        class="text-muted"
      >
        Complete profile to unlock download.
      </p>
      <p
        v-else
        class="text-muted"
      >
        Profile completed! You can now download your profile.
      </p>
    </UPageHeader>

    <UPageBody>
      <DashboardDisplayProfile />
    </UPageBody>

    <!-- Hidden print template -->
    <DashboardPrintProfile ref="printProfileRef" />
  </UPage>
</template>
