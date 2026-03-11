<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const authStore = useAuthStore()

// Mock data for now
const profileCompletion = ref(75)
const studentId = ref('GA-2024-001')
const cnic = ref('33100-1234567-1')

const academicInfo = {
  board: 'FBISE',
  group: 'Pre-Engineering',
  currentClass: '12th',
  previousSchool: 'City Public School'
}

const contactInfo = {
  phone: '+92 300 1234567',
  email: authStore.user?.email || 'student@galaxy.edu',
  address: 'Housing Colony No. 1, Jhang'
}

const interests = {
  aspiration: 'Software Engineer',
  likes: 'Mathematics',
  dislikes: 'Biology'
}

const downloadPdf = () => {
  // Logic for PDF download
  console.log('Downloading profile PDF...')
}

const cardsVariant = 'soft'
</script>

<template>
  <UPage>
    <UPageHeader
      :title="`Welcome, ${authStore.user?.first_name}!`"
    >
      <template #leading>
        <UAvatar
          :src="authStore.user?.avatarUrl"
          :alt="authStore.user?.first_name"
          size="lg"
          icon="i-lucide-user"
          class="ring-2 ring-offset-2 ring-offset-background"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <UPageGrid>
        <!-- Card 1: Profile Status & Reward (Tall Card) -->
        <UPageCard
          title="Profile Completion"
          icon="i-lucide-activity"
          :variant="cardsVariant"
          class="lg:row-span-2 h-full"
        >
          <div class="flex flex-col h-full gap-6">
            <div class="flex flex-col items-center gap-4">
              <div class="flex w-full justify-between items-end">
                <p class="font-bold text-dimmed uppercase">
                  Progress
                </p>
                <p class="font-bold text-primary text-end">
                  {{ profileCompletion }}%
                </p>
              </div>
              <UProgress
                v-model="profileCompletion"
                color="primary"
                class="rounded-full"
              />
              <p :class="['font-bold text-sm text-dimmed text-center', profileCompletion >= 90 ? 'text-success-600' : '']">
                {{ profileCompletion >= 65 ? 'Profile Download Unlocked' : 'Unlock PDF by reaching 65%' }}
              </p>
              <UButton
                label="Download Profile PDF"
                icon="i-lucide-download"
                size="xl"
                block
                :color="profileCompletion >= 65 ? 'primary' : 'neutral'"
                :variant="profileCompletion >= 65 ? 'solid' : 'soft'"
                :disabled="profileCompletion < 65"
                class="rounded-xl font-bold"
                @click="downloadPdf"
              />
            </div>

            <div class="flex-grow flex flex-col gap-6">
              <USeparator
                label="Pending Actions"
                class="opacity-50"
              />

              <div class="space-y-4">
                <div class="flex items-start gap-3 p-3 rounded-xl bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors">
                  <div class="mt-1 p-1 rounded-md bg-warning-500/10">
                    <UIcon
                      name="i-lucide-alert-circle"
                      class="w-4 h-4 text-warning-500"
                    />
                  </div>
                  <div>
                    <p class="text-xs font-bold">
                      Identity Verification
                    </p>
                    <p class="text-[10px] text-dimmed">
                      Upload CNIC Front/Back
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3 rounded-xl bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors">
                  <div class="mt-1 p-1 rounded-md bg-info-500/10">
                    <UIcon
                      name="i-lucide-book-open"
                      class="w-4 h-4 text-info-500"
                    />
                  </div>
                  <div>
                    <p class="text-xs font-bold">
                      Academic Transcripts
                    </p>
                    <p class="text-[10px] text-dimmed">
                      Grade 10 Marksheet required
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3 rounded-xl bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors">
                  <div class="mt-1 p-1 rounded-md bg-primary-500/10">
                    <UIcon
                      name="i-lucide-check-circle-2"
                      class="w-4 h-4 text-primary-500"
                    />
                  </div>
                  <div>
                    <p class="text-xs font-bold line-through opacity-50">
                      Personal Details
                    </p>
                    <p class="text-[10px] text-dimmed">
                      Completed successfully
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-auto p-4 rounded-xl bg-primary-500/5 border border-primary-500/10">
                <p class="text-[11px] text-center italic text-primary-600">
                  "Complete 100% of your profile to qualify for early scholarship consideration."
                </p>
              </div>
            </div>
          </div>
        </UPageCard>

        <!-- Card 2: Basic Info -->
        <UPageCard
          title="Personal Information"
          icon="i-lucide-user-circle"
          :variant="cardsVariant"
          class="h-full"
        >
          <div class="flex flex-col h-full space-y-4">
            <div class="space-y-3 flex-grow">
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Name
                </p>
                <p class="text-right">
                  {{ authStore.user?.user_metadata?.first_name || authStore.user?.first_name }} {{ authStore.user?.user_metadata?.last_name || '' }}
                </p>
              </div>
              <div class="flex justify-between items-center text-xs">
                <p class="text-dimmed">
                  Student ID
                </p>
                <p class="text-right">
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
              to="/dashboard/personal"
              class="rounded-xl font-bold"
            />
          </div>
        </UPageCard>

        <!-- Card 3: Contact Info -->
        <UPageCard
          title="Contact Information"
          icon="i-lucide-contact"
          :variant="cardsVariant"
          class="h-full"
        >
          <div class="flex flex-col h-full space-y-4">
            <div class="space-y-3 flex-grow">
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
              to="/dashboard/personal"
              class="rounded-xl font-bold"
            />
          </div>
        </UPageCard>

        <!-- Card 4: Academic Info -->
        <UPageCard
          title="Academic Info"
          icon="i-lucide-graduation-cap"
          :variant="cardsVariant"
          class="h-full"
        >
          <div class="flex flex-col h-full space-y-4">
            <div class="space-y-3 flex-grow">
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
              label="Add Marks / History"
              block
              size="xl"
              color="primary"
              variant="soft"
              to="/dashboard/history"
              class="rounded-xl font-bold"
            />
          </div>
        </UPageCard>

        <!-- Card 5: Interests -->
        <UPageCard
          title="Interests & Goals"
          icon="i-lucide-sparkles"
          :variant="cardsVariant"
          class="h-full"
        >
          <div class="flex flex-col h-full space-y-4">
            <div class="space-y-3 flex-grow">
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
              to="/dashboard/interests"
              class="rounded-xl font-bold"
            />
          </div>
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>

<style scoped>
</style>
