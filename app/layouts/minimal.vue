<script setup lang="ts">
const layoutStore = useLayoutStore()
</script>

<template>
  <div class="flex flex-col min-h-screen w-full">
    <UHeader
      mode="slideover"
      :title="layoutStore.websiteTitle"
      :toggle="false"
    >
      <template #title>
        <AppLogo />
      </template>

      <template #right>
        <UButton
          label="Back to Home"
          :icon="ICONS.nav.home"
          :to="URLS.home"
          class="items-center rounded"
          color="neutral"
          variant="soft"
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
