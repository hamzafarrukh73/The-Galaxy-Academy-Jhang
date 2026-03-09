<script setup lang="ts">
const layoutStore = useLayoutStore()
</script>

<template>
  <div class="min-h-screen w-full flex flex-col">
    <UHeader
      mode="slideover"
      :title="layoutStore.websiteTitle"
      :toggle="false"
    >
      <template #title>
        <img
          :src="IMAGES.logoCollapsed"
          class="rounded h-[7vh] w-[25vh]"
        >
        <h3 class="font-bold">
          {{ layoutStore.websiteTitle }}
        </h3>
      </template>

      <template #right>
        <div
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
