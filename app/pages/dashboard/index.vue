<script lang="ts" setup>
/**
 * Dashboard Overview
 *
 * Securely typed and live-synced profile summary.
 * Uses strict patterns to navigate complex JSON database structures.
 */
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'dashboard',
  auth: 'private',
  navGroup: 'dashboard'
})

// Types
interface SubjectScore {
  name: string
  liking: number
}

// Stores
const authStore = useAuthStore()
const profileStore = useProfileStore()
const academicStore = useAcademicStore()
const interestsStore = useInterestsStore()
const guardianStore = useGuardianStore()

// Strictly destructure stores to avoid deep proxy type inference issues
const { profile } = storeToRefs(profileStore)
const { academic } = storeToRefs(academicStore)
const { interests: interestsData } = storeToRefs(interestsStore)
const { guardian } = storeToRefs(guardianStore)

const printableProfileRef = ref<{ printProfile: () => void } | null>(null)

// Data fetching
const loadData = async () => {
  await Promise.all([
    profileStore.getProfile(),
    academicStore.getAcademic(),
    interestsStore.getInterests(),
    guardianStore.getGuardian()
  ])
}

onMounted(() => {
  loadData()
})

// Strictly typed profile completion calculation
const profileCompletion = computed<number>(() => {
  let totalFields = 0
  let filledFields = 0

  // Cast to Record<string, unknown> to avoid excessively deep instantiation
  // without using 'any' (monkey patching). This is a standard strict way
  // to access properties of complex generic objects.
  const p = profile.value as Record<string, unknown>
  const pFields = ['first_name', 'last_name', 'cnic', 'dob', 'gender', 'blood_group', 'address', 'city', 'province', 'avatar_url']

  const a = academic.value as Record<string, unknown>
  const aFields = ['current_school', 'current_class', 'current_group', 'current_medium']

  const i = interestsData.value as Record<string, unknown>
  const iFields = ['career_aspiration', 'hobby']

  totalFields = pFields.length + aFields.length + iFields.length

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

const studentId = computed(() => academic.value.student_id)
const cnic = computed(() => profile.value.cnic)

const academicInfo = computed(() => ({
  board: 'Not Recorded',
  group: academic.value.current_group,
  currentClass: academic.value.current_class,
  previousSchool: academic.value.current_school
}))

const contactInfo = computed(() => ({
  phone: guardian.value.phone,
  email: authStore.user?.email,
  address: `${profile.value.address || ''}, ${profile.value.city || ''}`
}))

// Strict handling of subject_ranking (Json type)
const interests = computed(() => {
  // Use Record<string, unknown> to access the ranking property without triggering type recursion
  const i = interestsData.value as Record<string, unknown>
  const rawRanking = i.subject_ranking

  // Use a clear type-guarded cast to SubjectScore[]
  const subjects = (Array.isArray(rawRanking) ? rawRanking : []) as unknown as SubjectScore[]
  const sorted = [...subjects].sort((a, b) => b.liking - a.liking)

  return {
    aspiration: String(i.career_aspiration || 'N/A'),
    likes: sorted[0]?.name || 'N/A',
    dislikes: sorted[sorted.length - 1]?.name || 'N/A'
  }
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
          :color="profileCompletion >= 80 ? 'primary' : 'neutral'"
          :variant="profileCompletion >= 80 ? 'solid' : 'soft'"
          :disabled="profileCompletion < 80"
          class="rounded-xl"
          @click="downloadPdf"
        />
      </div>
    </UPageHeader>

    <UPageBody>
      <UPageGrid>
        <UPageCard
          title="Personal Information"
          :icon="ICONS.nav.user"
          class="lg:col-span-2 h-full"
        >
          <div class="flex flex-col h-full gap-4">
            <div class="space-y-3 grow">
              <div class="flex flex-col justify-between items-start text-xs">
                <p class="text-dimmed">
                  Name
                </p>
                <p>
                  {{ authStore.user?.first_name }} {{ authStore.user?.last_name || '' }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Student ID
                </p>
                <p>
                  {{ studentId || 'N/A' }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  CNIC / B-Form
                </p>
                <p class="text-right">
                  {{ cnic || 'N/A' }}
                </p>
              </div>
            </div>
            <UButton
              label="Update Profile"
              block
              size="xl"
              color="primary"
              variant="soft"
              :to="URLS.dashboard.personal"
              class="rounded-xl font-bold"
            />
          </div>
        </UPageCard>

        <!-- Card 3: Contact Info -->
        <UPageCard
          title="Contact Information"
          :icon="ICONS.action.call"
          class="h-full"
        >
          <div class="flex flex-col h-full space-y-4">
            <div class="space-y-3 grow">
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Mobile No.
                </p>
                <p class="text-right">
                  {{ contactInfo.phone || 'N/A' }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Email
                </p>
                <p
                  class="text-right truncate max-w-[65%]"
                  :title="contactInfo.email"
                >
                  {{ contactInfo.email }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Address
                </p>
                <p
                  class="text-right truncate max-w-[65%]"
                  :title="contactInfo.address"
                >
                  {{ contactInfo.address }}
                </p>
              </div>
            </div>
            <UButton
              label="Edit Contact"
              block
              size="xl"
              color="primary"
              variant="soft"
              :to="URLS.dashboard.personal"
              class="rounded-xl font-bold"
            />
          </div>
        </UPageCard>

        <!-- Card 4: Academic Info -->
        <UPageCard
          title="Academic Info"
          :icon="ICONS.nav.education"
          class="h-full"
        >
          <div class="flex flex-col h-full space-y-4">
            <div class="space-y-3 grow">
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Class
                </p>
                <p class="text-right">
                  {{ academicInfo.currentClass || 'N/A' }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Current School
                </p>
                <p
                  class="text-right truncate max-w-[65%]"
                  :title="academicInfo.previousSchool"
                >
                  {{ academicInfo.previousSchool || 'N/A' }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Subjects Group
                </p>
                <p class="text-right">
                  {{ academicInfo.group || 'N/A' }}
                </p>
              </div>
            </div>
            <UButton
              label="Academic Records"
              block
              size="xl"
              color="primary"
              variant="soft"
              :to="URLS.dashboard.academic"
              class="rounded-xl font-bold"
            />
          </div>
        </UPageCard>

        <!-- Card 5: Interests -->
        <UPageCard
          title="Interests & Goals"
          :icon="ICONS.nav.interests"
          class="h-full"
        >
          <div class="flex flex-col h-full space-y-4">
            <div class="space-y-3 grow">
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Career Goals
                </p>
                <p class="text-right truncate max-w-[65%]">
                  {{ interests.aspiration || 'N/A' }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Favorite Subject
                </p>
                <p
                  class="text-right truncate max-w-[65%]"
                  :title="interests.likes"
                >
                  {{ interests.likes || 'N/A' }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Disliked Subject
                </p>
                <p
                  class="text-right truncate max-w-[65%]"
                  :title="interests.dislikes"
                >
                  {{ interests.dislikes || 'N/A' }}
                </p>
              </div>
            </div>
            <UButton
              label="Update Interests"
              block
              size="xl"
              color="primary"
              variant="soft"
              :to="URLS.dashboard.academic"
              class="rounded-xl font-bold"
            />
          </div>
        </UPageCard>
      </UPageGrid>
    </UPageBody>

    <!-- Printable Profile Component (Hidden) -->
    <DashboardPrintableProfile ref="printableProfileRef" />
  </UPage>
</template>

<style scoped>
</style>
