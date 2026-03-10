<script setup lang="ts">
const layoutStore = useLayoutStore()
</script>

<template>
  <div>
    <UDashboardGroup storage="cookie">
      <UDashboardSidebar
        collapsible
        :default-size="20"
        class="rounded-r-xl bg-neutral-800/10 dark:bg-primary-300/5"
      >
        <template #header="{ collapsed }">
          <AppLogo :collapsed="collapsed" />
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
              <AppLogo
                collapsed
                class="lg:hidden"
              />
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
</template>

<style scoped></style>
