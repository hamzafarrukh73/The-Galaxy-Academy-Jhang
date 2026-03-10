<script setup lang="ts">
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
</script>

<template>
  <div class="min-h-screen w-full flex flex-col">
    <UHeader
      mode="slideover"
      :title="layoutStore.websiteTitle"
      toggle-side="right"
      :menu="{ side: 'right', class: 'w-full' }"
    >
      <template #title>
        <AppLogo />
      </template>

      <template #default>
        <UNavigationMenu
          exact
          :items="layoutStore.navMenu"
          orientation="horizontal"
          variant="pill"
          color="neutral"
        />
      </template>

      <template #right>
        <div
          v-if="authStore.isAuthenticated"
          class="flex items-center gap-2"
        >
          <UButton
            label="Dashboard"
            :icon="ICONS.dashboard.home"
            :to="URLS.dashboard.home"
            class="rounded-full"
            color="primary"
            variant="solid"
          />
          <UDropdownMenu
            :items="layoutStore.profileMenu"
            :model="true"
            arrow
            size="lg"
            :content="{
              align: 'end',
              side: 'bottom'
            }"
            :ui="{
              content: 'min-w-[40vw] lg:min-w-[20vw]'
            }"
          >
            <UButton
              :avatar="{
                src: authStore.user?.avatarUrl,
                icon: ICONS.nav.user,
                size: 'sm'
              }"
              variant="outline"
              color="neutral"
              class="w-full rounded-full"
              size="xl"
            />
            <template #profile>
              <div
                class="flex flex-col gap-1 p-4 justify-center items-center"
                size="xl"
              >
                <UUser
                  :name="authStore.user?.email"
                  :description="authStore.user?.role"
                  :avatar="{
                    src: authStore.user?.avatarUrl,
                    icon: ICONS.nav.user
                  }"
                  orientation="horizontal"
                  size="xl"
                />
              </div>
            </template>
          </UDropdownMenu>
        </div>

        <div
          v-else
          class="flex items-center gap-1"
        >
          <UButton
            label="Signup"
            :to="URLS.auth.registration.home"
            class="rounded-full rounded-r-none items-center px-4 lg:px-8"
            color="primary"
            variant="solid"
          />
          <UButton
            label="Login"
            :to="URLS.auth.login"
            class="rounded-full rounded-l-none items-center px-4 lg:px-8"
            color="primary"
            variant="soft"
          />
        </div>
      </template>

      <template #body>
        <UNavigationMenu
          :items="layoutStore.navMenu"
          orientation="vertical"
          variant="pill"
          color="neutral"
          :ui="{
            link: 'flex h-[10vh]',
            linkLeadingIcon: 'size-5',
            linkLabel: 'text-lg truncate'
          }"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <div class="flex gap-2 items-center justify-center">
        <UIcon :name="ICONS.utils.copyright" />
        <p>{{ new Date().getFullYear() }} {{ layoutStore.websiteTitle }}. All rights reserved.</p>
      </div>
    </UFooter>
  </div>
</template>
