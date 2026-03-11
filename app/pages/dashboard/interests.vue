<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const state = reactive({
  careerAspiration: '',
  hobby: '',
  subjectRanking: [
    { name: 'Mathematics', liking: 3 },
    { name: 'Physics', liking: 3 },
    { name: 'Chemistry', liking: 3 },
    { name: 'Biology', liking: 3 },
    { name: 'Computer Science', liking: 3 },
    { name: 'English', liking: 3 },
    { name: 'Urdu', liking: 3 },
    { name: 'Islamiyat', liking: 3 },
    { name: 'Pakistan Studies', liking: 3 }
  ],
  source: '',
  otherSource: ''
})

const careerOptions = [
  'Doctor / MBBS', 'Engineer / Engineering', 'Chartered Accountant (CA)', 'Software Developer / IT', 'Civil Services (CSS)', 'Other'
]

const sourceOptions = [
  'Social Media (Facebook/Instagram)', 'Friend / Word of Mouth', 'Flyer / Brochure', 'Newspaper Advertisement', 'Other'
]

const onSaveSection = (section: string) => {
  console.log(`Saving ${section}:`, state)
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Interests & Goals"
      description="Tell us about your aspirations and learning preferences."
      icon="i-lucide-rocket"
    />

    <UPageBody>
      <UPageGrid>
        <!-- Card 1: Future Aspirations -->
        <UPageCard
          title="Future Aspirations"
          icon="i-lucide-rocket"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="Career Goal"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.careerAspiration"
                  :items="careerOptions"
                  placeholder="What do you want to be?"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Aspirations"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('Aspirations')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 2: Hobbies & Passions -->
        <UPageCard
          title="Hobbies & Passions"
          icon="i-lucide-heart"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="What's your hobby?"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <UInput
                  v-model="state.hobby"
                  placeholder="e.g., Reading, Coding, Cricket"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Hobby"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('Hobby')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 3: Discovery -->
        <UPageCard
          title="How did you hear about us?"
          icon="i-lucide-megaphone"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="Source"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.source"
                  :items="sourceOptions"
                  placeholder="Select Source"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                v-if="state.source === 'Other'"
                label="Specify"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <UInput
                  v-model="state.otherSource"
                  placeholder="Tell us more"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Source"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('Source')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 4: Subject Liking -->
        <UPageCard
          title="Subject Liking"
          icon="i-lucide-heart-pulse"
          variant="soft"
          class="lg:col-span-3"
        >
          <div class="flex flex-col h-full">
            <p class="text-zinc-500 text-sm mb-8">
              Rate your interest in each subject from 1 (Least Liked) to 5 (Most Liked). This helps us tailor your learning experience.
            </p>

            <div class="space-y-8 max-w-4xl mx-auto w-full px-4">
              <div
                v-for="subject in state.subjectRanking"
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

            <div class="pt-12">
              <UButton
                label="Save Subject Liking"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('Liking')"
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
