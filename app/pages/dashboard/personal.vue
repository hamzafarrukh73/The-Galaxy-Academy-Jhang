<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
  auth: 'private'
})

const authStore = useAuthStore()

const state = reactive({
  firstName: authStore.user?.user_metadata?.first_name || '',
  lastName: authStore.user?.user_metadata?.last_name || '',
  email: authStore.user?.email || '',
  dob: '',
  gender: '',
  cnic: '',
  bloodGroup: '',
  fatherName: '',
  guardianRelationship: '',
  guardianCnic: '',
  guardianMobile: '',
  whatsappNumber: '',
  isWhatsApp: false,
  guardianEmail: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  province: '',
  avatarUrl: authStore.user?.avatarUrl || ''
})

const genderOptions = ['Male', 'Female', 'Other']

const bloodGroupOptions = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
]

const relationshipOptions = [
  'Father', 'Mother', 'Guardian', 'Brother', 'Sister'
]

const provinceOptions = [
  'Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK'
]

const cityOptions = [
  'Jhang', 'Faisalabad', 'Lahore', 'Islamabad', 'Karachi', 'Multan'
]

const isAvatarHovered = ref(false)

const onSaveSection = (section: string) => {
  console.log(`Saving ${section}:`, state)
}

const onUploadPhoto = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target?.files
  if (files && files.length > 0) {
    console.log('Uploading photo:', files[0])
  }
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Personal Information"
      description="Maintain your profile details for academic records."
      icon="i-lucide-user"
    />

    <UPageBody>
      <UPageGrid>
        <!-- Card 1: Profile Picture -->
        <UPageCard
          title="Profile Picture"
          icon="i-lucide-camera"
          variant="soft"
          class="h-full"
        >
          <div
            class="flex flex-col h-full items-center justify-between text-center"
            @mouseenter="isAvatarHovered = true"
            @mouseleave="isAvatarHovered = false"
          >
            <div class="flex-grow flex flex-col items-center gap-8 py-8 w-full cursor-pointer">
              <UFileUpload
                class="flex flex-col items-center gap-4"
                @change="onUploadPhoto"
              >
                <UAvatar
                  :src="state.avatarUrl"
                  :icon="isAvatarHovered ? 'i-lucide-camera' : 'i-lucide-user'"
                  class="ring-4 ring-primary-500/10 w-32 h-32 hover:ring-primary-500/40 transition-all duration-300"
                />
              </UFileUpload>
            </div>

            <div class="pt-4 w-full">
              <UButton
                label="Save Photo"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('Photo')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 2: Identity Verification -->
        <UPageCard
          title="Identity Verification"
          icon="i-lucide-fingerprint"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="First Name"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <UInput
                  v-model="state.firstName"
                  placeholder="Muhammad"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Last Name"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <UInput
                  v-model="state.lastName"
                  placeholder="Ali Khan"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="CNIC"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <UInput
                  v-model="state.cnic"
                  placeholder="XXXXX-XXXXXXX-X"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Identity"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('Identity')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 3: Basic Information -->
        <UPageCard
          title="Basic Information"
          icon="i-lucide-info"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex flex-col flex-grow space-y-4 py-2">
              <UFormField
                label="Date of Birth"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <UInput
                  v-model="state.dob"
                  type="date"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Gender"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.gender"
                  :items="genderOptions"
                  placeholder="Select"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Blood Group"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.bloodGroup"
                  :items="bloodGroupOptions"
                  placeholder="Select"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Basic Info"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('Basic')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 4: Parents / Guardian Information -->
        <UPageCard
          title="Parents / Guardian Information"
          icon="i-lucide-users"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="Father's Name"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <UInput
                  v-model="state.fatherName"
                  placeholder="Father or Guardian Name"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Relationship"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.guardianRelationship"
                  :items="relationshipOptions"
                  placeholder="Select"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="CNIC"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <UInput
                  v-model="state.guardianCnic"
                  placeholder="XXXXX-XXXXXXX-X"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Guardian Details"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('GuardianDetails')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 5: Guardian Contact -->
        <UPageCard
          title="Guardian Contact"
          icon="i-lucide-phone"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="Email Address"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <UInput
                  v-model="state.guardianEmail"
                  placeholder="guardian@example.pk"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Mobile Number"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <UInput
                  v-model="state.guardianMobile"
                  placeholder="03xx-xxxxxxx"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Available on WhatsApp"
                orientation="horizontal"
                :ui="{ label: 'grow self-center text-zinc-500', container: 'grow' }"
              >
                <USwitch
                  v-model="state.isWhatsApp"
                  color="primary"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Contact"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('GuardianContact')"
              />
            </div>
          </div>
        </UPageCard>

        <!-- Card 6: Residential Address -->
        <UPageCard
          title="Residential Address"
          icon="i-lucide-home"
          variant="soft"
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex-grow space-y-4 py-2">
              <UFormField
                label="Permanent"
                orientation="horizontal"
                :ui="{ label: 'grow self-start pt-2 text-zinc-500', container: 'grow' }"
              >
                <UTextarea
                  v-model="state.addressLine1"
                  placeholder="House/Street, Area"
                  class="w-full"
                  :rows="3"
                />
              </UFormField>
              <UFormField
                label="City"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'flex-1' }"
              >
                <USelectMenu
                  v-model="state.city"
                  :items="cityOptions"
                  placeholder="Select"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Province"
                orientation="horizontal"
                :ui="{ label: 'flex-1 text-zinc-500', container: 'grow' }"
              >
                <USelectMenu
                  v-model="state.province"
                  :items="provinceOptions"
                  placeholder="Select"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="pt-4">
              <UButton
                label="Save Address"
                color="primary"
                variant="soft"
                size="xl"
                block
                class="rounded-xl font-bold"
                @click="onSaveSection('Address')"
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
