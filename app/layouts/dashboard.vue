<script setup lang="ts">
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

// Check auth on layout mount
onMounted(async () => {
  if (!await authStore.validateSession()) {
    authStore.logout()
    await navigateTo(URLS.auth.login)
  }
})
</script>

<template>
  <div
    v-if="authStore.authCheckLoading"
    class="flex items-center justify-center h-screen"
  >
    <div class="text-center">
      <p class="text-lg font-semibold">
        Loading...
      </p>
    </div>
  </div>
  <div v-else-if="authStore.isAuthenticated">
    <UDashboardGroup storage="cookie">
      <UDashboardSidebar
        collapsible
        :default-size="20"
        class="rounded-r-xl bg-neutral-800/10 dark:bg-primary-300/5"
      >
        <template #header="{ collapsed }">
          <UUser
            v-if="!collapsed"
            :avatar="{
              src: '',
              icon: ICONS.nav.user
            }"
          />
        <!-- <h3
          v-if="!collapsed"
          class="text-start"
        >
          Website Name
        </h3>
        <h3
          v-else
          class="text-center"
        >
          WN
        </h3> -->
        </template>
        <template #default="{ collapsed }">
          <UNavigationMenu
            :collapsed="collapsed"
            :items="layoutStore.dashboardMenu[0]"
            variant="pill"
            color="neutral"
            orientation="vertical"
            tooltip
            popover
            :ui="{
              link: 'flex h-[10vh]',
              linkLeadingIcon: 'size-5',
              linkLabel: 'text-lg truncate'
            }"
          />
        </template>
        <template #footer="{ collapsed }">
          <div class="flex flex-col w-full gap-3">
            <UFileUpload
              label="Drop your image here"
              description="SVG, PNG, JPG or GIF (max. 2MB)"
              class="w-full"
            />
            <UNavigationMenu
              :collapsed="collapsed"
              :items="layoutStore.dashboardMenu[1]"
              :disable-click-trigger="true"
              orientation="vertical"
              tooltip
              popover
              highlight
              class="w-full"
              size="xl"
            />
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar
            mode="slideover"
            toggle-side="left"
            :toggle="{ color: 'neutral' }"
            :menu="{ side: 'left' }"
          >
            <template #leading>
              <div class="flex items-center">
                <UDashboardSidebarCollapse />
                <USeparator orientation="vertical" />
              </div>
            </template>
            <template #title>
              <h2 class="lg:hidden">
                {{ layoutStore.websiteTitle }}
              </h2>
            </template>

            <template #right>
              <UButton
                :icon="ICONS.nav.home"
                label="Back to Home"
                variant="soft"
                color="neutral"
                :to="URLS.home"
              />
            </template>
          </UDashboardNavbar>
        <!-- <UDashboardToolbar>
          <template #left>
            <slot name="toolbar-left" />
          </template>
          <template #right>
            <slot name="toolbar-right" />
          </template>
        </UDashboardToolbar> -->
        </template>

        <template #body>
          <slot />
        </template>
        <template #footer />
      </UDashboardPanel>
    </UDashboardGroup>
  </div>
  <div
    v-else
    class="flex items-center justify-center h-screen"
  >
    <div class="text-center">
      <p class="text-lg font-semibold">
        Unauthorized
      </p>
      <p class="text-sm text-gray-500">
        Please log in to access this page.
      </p>
      <UButton
        :to="URLS.auth.login"
        class="mt-4"
      >
        Login
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
