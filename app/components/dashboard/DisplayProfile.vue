<script lang="ts" setup>
const {
  isLoading,
  prepareData,
  fullName,
  studentId,
  formatDate,
  classGroup,
  activityData,
  subjectScores,
  authStore,
  usersStore,
  studentsStore,
  emergencyStore
} = useStudentPrint()

defineExpose({ prepareData, isLoading })

onMounted(() => {
  prepareData()
})
</script>

<template>
  <div>
    <UPageGrid
      v-if="!isLoading"
    >
      <UContainer class="flex flex-col items-center justify-between gap-12 py-8">
        <UAvatar
          :src="usersStore.displayAvatarUrl || ''"
          class="size-[full] aspect-square border-2 p-1"
          :ui="{
            root: 'object-cover'
          }"
        />

        <AppContentFields
          title="Contact Details"
          :icon="ICONS.action.call"
          class="justify-between"
          :items="[
            { title: 'Phone', description: authStore.user?.phone || 'N/A' },
            { title: 'Email', description: authStore.user?.email || 'N/A' },
            { title: 'Location', description: `${usersStore.user?.address || 'N/A'}, ${usersStore.user?.city || ''}` }
          ]"
        />

        <AppContentFields
          title="Personal Details"
          :icon="ICONS.nav.user"
          class="justify-between"
          :items="[
            { title: 'CNIC / B-Form', description: usersStore.user?.cnic || '' },
            { title: 'Date of Birth', description: formatDate(usersStore.user?.dob) || '' }
          ]"
        />

        <AppContentFields
          title="Guardian Details"
          :icon="ICONS.nav.users"
          class="justify-between"
          :items="[
            { title: 'Name', description: emergencyStore.contact?.name || 'N/A' },
            { title: 'Relationship', description: emergencyStore.contact?.relationship || 'N/A' },
            { title: 'Phone', description: emergencyStore.contact?.phone || 'N/A' },
            { title: 'WhatsApp?', description: emergencyStore.contact?.is_whatapp ? 'Yes' : 'No' }
          ]"
        />
      </UContainer>

      <UContainer class="col-span-2 flex flex-col items-start justify-start gap-12">
        <div class="flex flex-col justify-center w-full gap-2 py-8">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <AppLogo collapsed />
              <div class="flex flex-col items-start justify-center">
                <h6 class="text-wrap! text-2x!">
                  The Galaxy Academy Jhang
                </h6>
              </div>
            </div>

            <div>
              <p class="text-muted text-wrap text-end">
                {{ new Date().toLocaleDateString() }}
              </p>
              <p class="text-muted text-wrap text-end">
                {{ new Date().toLocaleTimeString() }}
              </p>
            </div>
          </div>

          <div class="flex flex-col items-start justify-between w-full pt-8">
            <UPageFeature
              :title="fullName"
              :description="`ID: ${studentId}`"
              :ui="{
                root: 'flex items-start',
                title: 'text-4xl font-bold text-wrap break-all'
              }"
            />
          </div>
        </div>

        <div class="flex flex-col w-full gap-2">
          <AppContentFields
            title="Academic Summary"
            :icon="ICONS.nav.education"
            layout="grid"
            :columns="2"
            :items="[
              { title: 'School', description: studentsStore.student?.school || 'N/A' },
              { title: 'Class Group', description: classGroup },
              { title: 'Class', description: studentsStore.student?.class || 'N/A' },
              { title: 'Subject Group', description: studentsStore.student?.subject_group || 'N/A' }
            ]"
          />
        </div>

        <div class="flex flex-col w-full gap-2">
          <AppContentFields
            title="Interests & Goals"
            :icon="ICONS.info.trophy"
            layout="grid"
            :columns="2"
            :items="[
              { title: 'Career Goal', description: activityData.aspiration },
              { title: 'Goal Motivation', description: activityData.motivation },
              { title: 'Hobby', description: activityData.hobby },
              { title: 'Role Model', description: activityData.role_model },
              { title: 'Hafiz-e-Quran', description: activityData.is_hafiz },
              { title: 'Likes Job?', description: activityData.want_job }
            ]"
          />
        </div>

        <div class="flex flex-col w-full gap-2">
          <AppContentFields
            title="Subject Preference"
            :icon="ICONS.info.stats"
            layout="grid"
            :columns="2"
          >
            <UPageFeature
              v-for="subject in subjectScores"
              :key="subject.name"
              :title="subject.name"
              :ui="{
                wrapper: 'w-full'
              }"
            >
              <template #description>
                <UProgress
                  v-model="subject.rating"
                  :max="5"
                  class="w-full"
                />
              </template>
            </UPageFeature>
          </AppContentFields>
        </div>
      </UContainer>
    </UPageGrid>

    <!-- Loading State -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-4 py-20 animate-pulse"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="size-16 rounded-full animate-spin"
      />
      <p class="text-muted font-bold text-4xl">
        Loading...
      </p>
    </div>
  </div>
</template>

<style scoped></style>
