<script setup lang="ts">
// import type { NavigationMenuItem } from 'nuxt/ui'

const navItems = useNavigation()
</script>

<template>
  <div>
    <UDashboardGroup storage="cookie">
      <UDashboardSidebar
        collapsible
        :default-size="20"
        class="rounded-r-xl bg-neutral-800/10 dark:bg-primary-300/10"
      >
        <template #header="{ collapsed }">
          <AppLogo :collapsed="collapsed" />
        </template>
        <template #default="{ collapsed }">
          <UNavigationMenu
            orientation="vertical"
            tooltip
            popover
            :collapsed="collapsed"
            :items="navItems[0]"
            :ui="{
              link: 'gap-2 py-4'
            }"
          />
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
              <UDashboardSidebarCollapse />
            </template>
            <template #title>
              <AppLogo
                collapsed
                class="lg:hidden"
              />
            </template>

            <template #right>
              <UButton
                label="Back to Home"
                variant="soft"
                color="neutral"
                :icon="ICONS.nav.home"
                :to="URLS.home"
              />
              <ProfileDropdown />
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
</template>

<style scoped></style>
