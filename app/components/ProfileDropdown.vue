<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const profileStore = useProfileStore()

onMounted(async () => {
  await profileStore.getProfile()
})

const profileMenu = computed<DropdownMenuItem[]>(() => {
  return [
    { slot: 'profile' as const },
    { type: 'separator' },
    {
      icon: ICONS.nav.user,
      label: 'Manage Account',
      to: URLS.dashboard.personal
    }, {
      icon: ICONS.action.exit,
      label: 'Logout',
      color: 'error',
      onSelect: () => authStore.logout()
    }
  ]
})
</script>

<template>
  <UDropdownMenu
    :items="profileMenu"
    :model="true"
    arrow
    size="lg"
    :content="{
      align: 'end',
      side: 'bottom'
    }"
    :ui="{
      item: 'items-center gap-4',
      content: 'min-w-[40vw] lg:min-w-[20vw]'
    }"
  >
    <UButton
      :avatar="{
        src: profileStore.profile.avatar_url,
        icon: ICONS.nav.user,
        size: 'md'
      }"
      variant="outline"
      color="neutral"
      class="rounded-full"
      size="xl"
    />
    <template #profile>
      <UUser
        :name="profileStore.fullName"
        :description="authStore.user?.email"
        :avatar="{
          src: profileStore.profile.avatar_url,
          icon: ICONS.nav.user,
          loading: 'lazy'
        }"
        orientation="horizontal"
        size="3xl"
        class="items-center text-start w-full p-4"
      />
    </template>
  </UDropdownMenu>
</template>

<style scoped>

</style>
