<script lang="ts" setup>
import {
  identitySchema,
  guardianSchema,
  addressSchema
} from '~/schemas/dashboard/personal'
import type { Users } from '~/repository/modules/users'
import type { Guardians } from '~/repository/modules/guardians'

definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const usersStore = useUsersStore()
const guardianStore = useGuardianStore()

const userState = ref<Users['Update']>({
  first_name: '',
  last_name: '',
  cnic: '',
  dob: '',
  gender: undefined,
  address: '',
  city: undefined,
  province: undefined,
  avatar_url: ''
})

const guardianState = ref<Guardians['Update']>({
  name: '',
  relationship: '',
  phone: '',
  email: ''
})

const loadData = async () => {
  await Promise.all([
    usersStore.getUser(),
    guardianStore.getGuardian()
  ])
  userState.value = { ...usersStore.user }
  guardianState.value = { ...guardianStore.guardian }
}

onMounted(() => {
  loadData()
})

const onSaveUser = async () => {
  await usersStore.upsertUser({ ...userState.value })
  userState.value = { ...usersStore.user }
}

const onSaveGuardian = async () => {
  await guardianStore.upsertGuardian(guardianState.value)
  guardianState.value = { ...guardianStore.guardian }
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Personal Information"
      description="Maintain your profile and guardian details for student records."
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
                  :src="usersStore.displayAvatarUrl || ''"
                  :icon="ICONS.nav.user"
                  class="size-[25vh] aspect-square"
                  :class="usersStore.displayAvatarUrl ? '' : 'p-8'"
                  :ui="{
                    icon: 'size-full'
                  }"
                />
                <UInput
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  :loading="usersStore.avatarUploading"
                  :disabled="usersStore.avatarUploading"
                  @change="usersStore.handleAvatarSelect"
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
                :loading="usersStore.avatarUploading"
                @click="onSaveUser"
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
            :state="userState"
            :schema="identitySchema"
            submit-label="Save Identity"
            @submit="onSaveUser"
          />
        </UPageCard>

        <!-- Card 3: Guardian Information -->
        <UPageCard
          title="Guardian Info"
          :icon="ICONS.nav.users"
          class="lg:col-span-3 h-full"
        >
          <AppForm
            :state="guardianState"
            :schema="guardianSchema"
            grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
            submit-label="Save Guardian Info"
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
            :state="userState"
            :schema="addressSchema"
            @submit="onSaveUser"
          />
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>

<style scoped>
</style>
