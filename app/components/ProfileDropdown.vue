<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const usersStore = useUsersStore()

onMounted(async () => {
  await usersStore.getUser()
})

const fullName = computed(() => {
  return `${usersStore.user?.first_name || ''} ${usersStore.user?.last_name || ''}`.trim() || 'User'
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
      class: 'hover:cursor-pointer',
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
        src: usersStore.displayAvatarUrl || '',
        icon: ICONS.nav.user,
        loading: 'lazy',
        ui: {
          icon: 'size-full'
        },
        class: 'size-[3vh] lg:size-[5vh]'
      }"
      variant="outline"
      color="neutral"
      class="rounded-full hover:cursor-pointer p-1"
    />
    <template #profile>
      <UUser
        :name="fullName"
        :description="authStore.user?.email"
        :avatar="{
          src: usersStore.displayAvatarUrl || '',
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
