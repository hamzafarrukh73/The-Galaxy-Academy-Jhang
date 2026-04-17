<script lang="ts" setup>
import {
  identitySchema,
  emergencySchema,
  addressSchema
} from '~/schemas/dashboard/personal'
import type { Users } from '~/repository/modules/users'
import type { EmergencyContacts } from '~/repository/modules/emergency_contacts'

definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const usersStore = useUsersStore()
const studentsStore = useStudentsStore()
const emergencyStore = useEmergencyStore()

const userState = ref<Users['Update']>({
  first_name: '',
  last_name: '',
  cnic: '',
  dob: '',
  gender: undefined,
  address: '',
  city: undefined,
  province: undefined,
  phone: '',
  avatar_url: ''
})

const emergencyState = ref<EmergencyContacts['Update']>({
  name: '',
  relationship: undefined,
  phone: '',
  is_whatapp: false
})

const loadData = async () => {
  await Promise.all([
    usersStore.getUser(),
    studentsStore.getStudent()
  ])
  await emergencyStore.getContact()

  userState.value = { ...usersStore.user }
  emergencyState.value = { ...emergencyStore.contact }
}

onMounted(() => {
  loadData()
})

const onSaveUser = async () => {
  await usersStore.upsertUser({ ...userState.value })
  userState.value = { ...usersStore.user }
}

const onSaveEmergency = async () => {
  await emergencyStore.upsertContact(emergencyState.value)
  emergencyState.value = { ...emergencyStore.contact }
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Personal Details"
      description="Maintain your profile and guardian details for records."
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
            :state="emergencyState"
            :schema="emergencySchema"
            grid-class="grid grid-cols-1 md:grid-cols-2 gap-4"
            submit-label="Save Guardian Info"
            @submit="onSaveEmergency"
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
