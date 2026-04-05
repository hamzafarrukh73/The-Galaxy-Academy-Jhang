<script lang="ts" setup>
/**
 * Student Record Template
 *
 * Supports two modes:
 * - 'preview': Fluid, mobile-first layout that blends into the dashboard
 * - 'print': Fixed A4 layout with white background for printing
 */

// Types
import type { Tables } from '~/repository'

// Props
const props = withDefaults(defineProps<{
  mode?: 'preview' | 'print'
}>(), {
  mode: 'print'
})

// Stores
const authStore = useAuthStore()
const usersStore = useUsersStore()
const studentsStore = useStudentsStore()
const activitiesStore = useActivitiesStore()
const guardianStore = useGuardianStore()

const { $api } = useNuxtApp()

// State
const isLoading = ref(true)

const subjects = ref<Tables['subjects']['Row'][]>([])
const ratings = ref<Tables['subject_rating']['Row'][]>([])

const prepareData = async () => {
  isLoading.value = true
  try {
    const results = await Promise.allSettled([
      usersStore.getUser(),
      studentsStore.getStudent(),
      activitiesStore.getActivities(),
      guardianStore.getGuardian(),
      $api.subjects.list(),
      $api.subject_rating.list()
    ])

    if (results[4].status === 'fulfilled') subjects.value = results[4].value as Tables['subjects']['Row'][]
    if (results[5].status === 'fulfilled') ratings.value = results[5].value as Tables['subject_rating']['Row'][]
  } finally {
    isLoading.value = false
  }
}

// Helpers
const fullName = computed(() => {
  const p = usersStore.user
  return `${p?.first_name || ''} ${p?.last_name || ''}`.trim() || 'Student Name'
})

const studentId = computed(() => studentsStore.student?.id || 'PENDING')

const formatDate = (date: string | null | undefined) =>
  date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'

const activityData = computed(() => {
  const i = activitiesStore.activities
  return {
    aspiration: String(i?.career_goal || 'N/A'),
    hobby: String(i?.hobby || 'N/A'),
    role_model: String(i?.role_model || 'N/A'),
    is_hafiz: i?.is_hafiz ? 'Yes' : 'No',
    want_job: i?.want_job ? 'Yes' : 'No'
  }
})

const subjectScores = computed(() => {
  const student = studentsStore.student
  if (!student) return []

  // Ensure we have a base list of subjects even if the DB table is empty/missing
  const baseSubjects = subjects.value.length > 0
    ? subjects.value.map(s => ({ id: s.id, name: s.name }))
    : [
        { id: '1', name: 'Mathematics' },
        { id: '2', name: 'Physics' },
        { id: '3', name: 'Chemistry' },
        { id: '4', name: 'Computer Science' },
        { id: '5', name: 'English' },
        { id: '6', name: 'Urdu' }
      ]

  const studentRatings = ratings.value.filter((r: Tables['subject_rating']['Row']) => r.student_id === student.id)

  return baseSubjects.map((s: { id: string, name: string }) => {
    const rating = studentRatings.find((r: Tables['subject_rating']['Row']) => r.subject_id === s.id)
    return {
      name: s.name,
      liking: rating?.rating ? Number(rating.rating) : 3
    }
  }).sort((a: { liking: number }, b: { liking: number }) => b.liking - a.liking)
})

const isPreview = computed(() => props.mode === 'preview')

defineExpose({ prepareData, isLoading })

onMounted(() => {
  prepareData()
})
</script>

<template>
  <div
    :class="[
      'record-container',
      isPreview ? 'record-preview' : 'record-print bg-white shadow-2xl print:shadow-none'
    ]"
  >
    <template v-if="!isLoading">
      <!-- LEFT COLUMN -->
      <div
        :class="[
          'left-col flex flex-col items-center gap-6 p-8',
          isPreview
            ? 'bg-elevated rounded-2xl lg:rounded-none lg:rounded-l-2xl'
            : 'bg-neutral-100 border-r border-neutral-200'
        ]"
      >
        <!-- Avatar -->
        <UAvatar
          :src="usersStore.displayAvatarUrl || ''"
          size="3xl"
          :class="[
            isPreview ? 'size-28 lg:size-36 border-4' : 'size-56 border-8',
            'shadow-xl rounded-3xl',
            isPreview ? 'border-default' : 'border-white'
          ]"
        />

        <AppContentFields
          title="Contact Details"
          :items="[
            { title: 'Phone', icon: ICONS.action.call, description: authStore.user?.phone || 'N/A' },
            { title: 'Email', icon: ICONS.info.mail, description: authStore.user?.email || 'N/A' },
            { title: 'Address', icon: ICONS.nav.home, description: `${usersStore.user?.address || 'N/A'}, ${usersStore.user?.city || ''}` }
          ]"
        />

        <AppContentFields
          title="Personal Details"
          :icon="ICONS.nav.user"
          :items="[
            { title: 'CNIC / B-Form', description: usersStore.user?.cnic || 'N/A' },
            { title: 'Date of Birth', description: formatDate(usersStore.user?.dob) || 'N/A' }
          ]"
        />

        <AppContentFields
          title="Guardian Details"
          :icon="ICONS.nav.users"
          :items="[
            { title: 'Name', description: guardianStore.guardian?.name || 'N/A' },
            { title: 'Relationship', description: guardianStore.guardian?.relationship || 'N/A' },
            { title: 'CNIC', description: guardianStore.guardian?.cnic || 'N/A' },
            { title: 'Phone', description: guardianStore.guardian?.phone || 'N/A' }
          ]"
        />
      </div>

      <!-- RIGHT COLUMN -->
      <div
        :class="[
          'right-col flex flex-col gap-6 p-6 lg:p-8',
          isPreview ? '' : ''
        ]"
      >
        <!-- Header: Name + Class Overview -->
        <div class="flex flex-col gap-1">
          <p class="text-primary font-black uppercase tracking-[0.2em] text-[8pt]">
            Student Record
          </p>
          <h1 :class="['font-black tracking-tight', isPreview ? 'text-2xl lg:text-4xl text-default' : 'text-5xl text-neutral-900']">
            {{ fullName }}
          </h1>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span class="px-2 py-0.5 bg-primary/10 text-primary text-[8pt] font-bold rounded">
              ID: {{ studentId }}
            </span>
            <template v-if="studentsStore.student?.class">
              <span :class="['text-[8pt]', isPreview ? 'text-dimmed' : 'text-neutral-400']">|</span>
              <span :class="['font-medium text-[9pt]', isPreview ? 'text-muted' : 'text-neutral-500']">
                {{ studentsStore.student.class }} · {{ studentsStore.student.subject_group || 'No Group' }}
              </span>
            </template>
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <AppContentFields
            title="Academic Overview"
            :icon="ICONS.nav.education"
            layout="grid"
            :columns="3"
            class="gap-x-12 gap-y-4"
            :items="[
              { title: 'School / College', description: studentsStore.student?.school || 'N/A' },
              { title: 'Grade / Class', description: String(studentsStore.student?.class || 'N/A') },
              { title: 'Subjects Group', description: String(studentsStore.student?.subject_group || 'N/A') }
            ]"
          />

          <AppContentFields
            title="Interests & Goals"
            :icon="ICONS.info.trophy"
            layout="grid"
            :columns="3"
            class="gap-x-12 gap-y-4 pt-6 border-t border-muted/20"
            :items="[
              { title: 'Career Goal', description: activityData.aspiration },
              { title: 'Hobby / Passion', description: activityData.hobby },
              { title: 'Role Model', description: activityData.role_model },
              { title: 'Hafiz-e-Quran', description: activityData.is_hafiz },
              { title: 'Likes Job?', description: activityData.want_job }
            ]"
          />
        </div>

        <div class="flex flex-col gap-4 mt-6">
          <p class="section-title">
            <UIcon :name="ICONS.nav.interests" />
            SUBJECT PREFERENCES
          </p>
          <div class="grid grid-cols-3 gap-y-4 gap-x-8">
            <div
              v-for="subject in subjectScores"
              :key="subject.name"
              class="flex flex-col gap-1"
            >
              <span class="text-[9pt] font-extrabold uppercase text-neutral-400 tracking-tight leading-none">{{ subject.name }}</span>
              <div class="flex items-center gap-1.5 h-4">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="h-2 w-4 rounded-sm"
                  :class="i <= subject.liking ? 'bg-primary' : 'bg-neutral-100'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          :class="[
            'mt-auto pt-6 border-t border-dashed flex items-end justify-between gap-4',
            isPreview ? 'border-muted' : 'border-neutral-200'
          ]"
        >
          <div :class="['text-[8pt]', isPreview ? 'text-dimmed' : 'text-neutral-400']">
            <p :class="['font-bold', isPreview ? 'text-muted' : 'text-neutral-600']">
              The Galaxy Academy Jhang
            </p>
            <p>Generated on {{ new Date().toLocaleDateString() }}</p>
            <p>Ref: {{ studentId }}/REC</p>
          </div>
          <AppLogo class="h-8 opacity-50 grayscale" />
        </div>
      </div>
    </template>

    <!-- Loading State -->
    <div
      v-else
      class="col-span-full flex flex-col items-center justify-center gap-4 py-20 animate-pulse"
    >
      <div class="size-12 rounded-full bg-primary/10 border-4 border-primary/20 border-t-primary animate-spin" />
      <p class="text-muted font-medium text-sm">
        Loading Record...
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Layout */
.record-container {
  display: grid;
  overflow: hidden;
}

/* Print: Fixed A4 two-column */
.record-print {
  grid-template-columns: 88mm 1fr;
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  margin: 0 auto;
  font-size: 13pt;
  line-height: 1.6;
}

.record-print .section-title {
  font-size: 13pt;
  font-weight: 900;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  letter-spacing: 0.15em;
  border-bottom: 2px solid #2563eb; /* Stronger blue */
  color: #111827; /* Near black */
}

.record-print .info-label {
  font-size: 9pt;
  font-weight: 800;
  margin-bottom: 2px;
  color: #4b5563; /* Gray 600 - clearly visible but secondary */
}

.record-print .info-value {
  font-size: 13pt;
  font-weight: 600;
  color: #111827; /* Near black */
}

.record-print .info-item {
  margin-bottom: 1.25rem;
}

.record-print .left-col {
  padding: 15mm 8mm;
  gap: 3rem;
  color: #111827;
}

.record-print .right-col {
  padding: 25mm 15mm 15mm 15mm; /* Extra top padding to push content down */
  gap: 4rem;
  color: #111827;
}

/* Preview: Responsive, mobile-first */
.record-preview {
  grid-template-columns: 1fr;
  width: 100%;
}

@media (min-width: 1024px) {
  .record-preview {
    grid-template-columns: 280px 1fr;
  }
}

/* Shared helpers */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--ui-border-muted, #e5e5e5);
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
}

.info-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ui-text-dimmed, #a3a3a3);
}

.info-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ui-text, #262626);
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }
}

* {
  box-sizing: border-box;
}
</style>
