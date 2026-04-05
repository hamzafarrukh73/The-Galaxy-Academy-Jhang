<script lang="ts" setup>
/**
 * Dashboard Overview
 *
 * Shows a live preview of the student admission record.
 * Print is triggered via a hidden iframe loading the dedicated print route.
 */

import DashboardPrintTemplate from '~/components/dashboard/PrintTemplate.vue'
import DashboardInstantPrintableProfile from '~/components/dashboard/InstantPrintableProfile.vue'

definePageMeta({
  layout: 'dashboard',
  auth: 'private',
  navGroup: 'dashboard'
})

// Stores
const usersStore = useUsersStore()
const studentsStore = useStudentsStore()
const activitiesStore = useActivitiesStore()
const guardianStore = useGuardianStore()

const templateRef = ref<InstanceType<typeof DashboardPrintTemplate> | null>(null)
const printableProfileRef = ref<InstanceType<typeof DashboardInstantPrintableProfile> | null>(null)

// Data fetching
onMounted(async () => {
  await Promise.all([
    usersStore.getUser(),
    studentsStore.getStudent(),
    activitiesStore.getActivities(),
    guardianStore.getGuardian()
  ])

  if (templateRef.value) {
    await templateRef.value.prepareData()
  }
})

// Profile completion calculation
const profileCompletion = computed<number>(() => {
  const p = usersStore.user
  const a = studentsStore.student
  const i = activitiesStore.activities

  if (!p || !a || !i) return 0

  let filledFields = 0

  const pFields = ['first_name', 'last_name', 'cnic', 'dob', 'address', 'city', 'province', 'avatar_url'] as const
  const aFields = ['school', 'class', 'subject_group'] as const
  const iFields = ['career_goal'] as const

  const totalFields = pFields.length + aFields.length + iFields.length

  pFields.forEach((f) => {
    if (p[f]) filledFields++
  })
  aFields.forEach((f) => {
    if (a[f]) filledFields++
  })
  iFields.forEach((f) => {
    if (i[f]) filledFields++
  })

  return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
})

const downloadPdf = () => {
  printableProfileRef.value?.printProfile()
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
          class="rounded-xl"
          @click="downloadPdf"
        />
      </div>
    </UPageHeader>

    <UPageBody>
      <DashboardPrintTemplate
        ref="templateRef"
        mode="preview"
      />
    </UPageBody>

    <DashboardInstantPrintableProfile ref="printableProfileRef" />
  </UPage>
</template>
