<script setup lang="ts">
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const navItems = useNavigation()
</script>

<template>
  <div class="flex flex-col min-h-screen w-full">
    <UHeader
      mode="slideover"
      :title="layoutStore.websiteTitle"
      toggle-side="right"
      :menu="{ side: 'right' }"
      class="shadow-2xl shadow-primary-500/20"
    >
      <template #title>
        <AppLogo />
      </template>

      <template #default>
        <UNavigationMenu
          :items="navItems"
          exact
        />
      </template>

      <template #right>
        <div
          v-if="authStore.isAuthenticated"
          class="flex items-center gap-2"
        >
          <UButton
            label="Dashboard"
            :icon="ICONS.nav.home"
            :to="URLS.dashboard.home"
            class="rounded-full"
          />
          <ProfileDropdown />
        </div>

        <div
          v-else
        >
          <!-- <AuthButtonGroup /> -->
          <UButton
            label="Get Started"
            :icon="ICONS.action.start"
            :to="URLS.auth.registration.home"
            class="rounded-full"
          />
        </div>
      </template>

      <template #body>
        <UNavigationMenu
          orientation="vertical"
          :items="navItems"
          :ui="{
            link: 'gap-4 py-4'
          }"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <div class="flex items-center justify-center gap-2">
        <UIcon :name="ICONS.info.copyright" />
        <p>{{ new Date().getFullYear() }} {{ layoutStore.websiteTitle }}. All rights reserved.</p>
      </div>
    </UFooter>
  </div>
</template>
