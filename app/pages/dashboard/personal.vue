<script lang="ts" setup>
import {
  identitySchema,
  guardianSchema,
  emergencySchema,
  addressSchema
} from '~/schemas/dashboard/personal'

definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const profileStore = useProfileStore()
const guardianStore = useGuardianStore()

const loadData = async () => {
  await Promise.all([
    profileStore.getProfile(),
    guardianStore.getGuardian()
  ])
}

onMounted(() => {
  loadData()
})

const onSaveProfile = async () => {
  await profileStore.upsertProfile()
}

const onSaveGuardian = async () => {
  await guardianStore.upsertGuardian()
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Personal Information"
      description="Maintain your profile and guardian details for academic records."
      :icon="ICONS.nav.user"
    />

    <UPageBody>
      <UPageGrid>
        <!-- Card 1: Profile Picture -->
        <UPageCard
          title="Profile Picture"
          :icon="ICONS.action.camera"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="grow flex flex-col items-center justify-center gap-4">
              <UFileUpload
                class="flex flex-col items-center gap-4 size-full p-4"
              >
                <UAvatar
                  :src="profileStore.displayAvatarUrl"
                  :icon="ICONS.nav.user"
                  class="size-[25vh] aspect-square"
                  :class="profileStore.displayAvatarUrl ? '' : 'p-8'"
                  :ui="{
                    icon: 'size-full'
                  }"
                />
                <UInput
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  :disabled="profileStore.avatarUploading"
                  @change="profileStore.handleAvatarSelect"
                />
              </UFileUpload>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Photo"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveProfile"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 2: Identity Verification -->
        <UPageCard
          title="Identity"
          :icon="ICONS.info.identity"
          class="lg:col-span-2 h-full"
        >
          <AppForm
            :state="profileStore.profile"
            :schema="identitySchema"
            submit-label="Save Identity"
            @submit="onSaveProfile"
          />
        </UPageCard>

        <!-- Card 3: Guardian Information -->
        <UPageCard
          title="Guardian Info"
          :icon="ICONS.nav.users"
          class="lg:col-span-2 h-full"
        >
          <AppForm
            :state="guardianStore.guardian"
            :schema="guardianSchema"
            submit-label="Save Guardian Info"
            @submit="onSaveGuardian"
          />
        </UPageCard>

        <!-- Card 4: Emergency Contact -->
        <UPageCard
          title="Emergency Contact"
          :icon="ICONS.action.call"
          class="h-full"
        >
          <AppForm
            :state="guardianStore.guardian"
            :schema="emergencySchema"
            grid-class="grid grid-cols-1 gap-4"
            submit-label="Save Emergency Contact"
            @submit="onSaveGuardian"
          />
        </UPageCard>

        <!-- Card 5: Residential Address -->
        <UPageCard
          title="Residential Address"
          :icon="ICONS.nav.home"
          class="h-full lg:col-span-3"
        >
          <AppForm
            :state="profileStore.profile"
            :schema="addressSchema"
            @submit="onSaveProfile"
          />
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>

<style scoped>
</style>
