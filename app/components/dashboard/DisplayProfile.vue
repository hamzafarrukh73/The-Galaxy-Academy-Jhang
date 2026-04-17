<script lang="ts" setup>
const {
  isLoading,
  prepareData,
  fullName,
  studentId,
  formatDate,
  classGroup,
  activityData,
  academicBackground,
  authStore,
  usersStore,
  studentsStore,
  emergencyStore
} = useStudentPrint()

const userEmail = computed(() => authStore.user?.email || 'N/A')

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
          :icon="ICONS.nav.user"
          class="size-[full] max-w-full aspect-square border-2 p-1"
          :ui="{
            root: 'object-cover'
          }"
        />

        <AppContentFields
          title="Contact Details"
          :icon="ICONS.action.call"
          class="justify-between"
          :items="[
            { title: 'Phone', description: usersStore.user?.phone || 'N/A' },
            { title: 'Email', description: userEmail },
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
            {
              title: emergencyStore.contact?.is_whatapp ? 'Phone (Whatsapp)' : 'Phone',
              description: emergencyStore.contact?.phone || 'N/A'
            }
          ]"
        />
      </UContainer>

      <UContainer class="col-span-2 flex flex-col items-start justify-between gap-12">
        <div class="flex flex-col justify-center w-full gap-2 py-8">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <AppLogo collapsed />
              <div class="flex flex-col items-start justify-center">
                <h6 class="text-start text-wrap! text-3xl! font-semibold! uppercase">
                  The Galaxy Academy Jhang
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col grow items-start justify-between w-full">
          <UPageFeature
            :title="fullName"
            :description="`ID: ${studentId}`"
            class="px-4"
            :ui="{
              root: 'flex items-start',
              title: 'text-5xl font-bold text-wrap break-all'
            }"
          />

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
              title="Academic Background"
              :icon="ICONS.nav.education"
              layout="grid"
              :columns="2"
              :items="[
                { title: 'Previous School', description: academicBackground.school },
                { title: 'Last Class', description: academicBackground.lastClass },
                { title: 'Marks %', description: academicBackground.marksPercent },
                { title: 'Passing Year', description: academicBackground.passingYear }
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
                { title: 'Career Motivation', description: activityData.motivation },
                { title: 'Hobby', description: activityData.hobby },
                { title: 'Hafiz-e-Quran', description: activityData.is_hafiz }
              ]"
            />
          </div>
        </div>
        <!-- Footer Section -->
        <div class="flex items-end justify-end w-full pt-28">
          <!-- <UPageFeature
            title="Generated On"
            :description="`${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`"
          /> -->
          <div class="flex flex-col items-center gap-2">
            <USeparator color="primary" />
            <p class="font-bold text-lg uppercase tracking-wider">
              Managing Director
            </p>
          </div>
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
