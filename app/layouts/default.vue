<script setup lang="ts">
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const user = authStore.getUser
</script>

<template>
  <!-- <div class="min-h-screen w-screen grid grid-rows-[auto_1fr_auto]"> -->
  <div class="min-h-screen w-full flex flex-col">
    <UHeader
      mode="slideover"
      :title="layoutStore.websiteTitle"
      toggle-side="right"
      :menu="{ side: 'right', class: 'w-full' }"
    >
      <template #title>
        <img
          :src="layoutStore.logoUrl"
          class="rounded h-[7vh] w-[25vh] object-cover"
        >
        <!-- <h3 class="font-bold">
          {{ layoutStore.websiteTitle }}
        </h3> -->
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
              content: 'w-[40vw] lg:w-[20vw]'
            }"
          >
            <UButton
              :avatar="{
                src: user.image_url,
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
                  :name="user.username"
                  :description="user.role"
                  :avatar="{
                    src: user.image_url,
                    icon: ICONS.nav.user
                  }"
                  orientation="horizontal"
                  size="xl"
                />
              </div>
            </template>
            <template #utils>
              <div class="w-full flex flex-row justify-between items-center">
                <div class="flex items-center gap-3">
                  <UIcon :name="ICONS.utils.quickAccess" />
                  <span>Quick Access</span>
                </div>
                <UColorModeButton />
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
      <!-- <div class="absolute bottom-[15%] right-[5%]">
        <UButton icon="i-simple-icons-whatsapp"  class="rounded-full" size="xl" variant="soft" color="neutral" />
      </div> -->
    </UMain>

    <UFooter>
      <div class="flex gap-2 items-center justify-center">
        <UIcon :name="ICONS.utils.copyright" />
        <p>{{ new Date().getFullYear() }} {{ layoutStore.websiteTitle }}. All rights reserved.</p>
      </div>
    </UFooter>
  </div>
</template>
