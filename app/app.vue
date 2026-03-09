<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'The Galaxy Academy Jhang'
const description = ''

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const toaster = { position: 'top-center', duration: 3000 } as const
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLoadingIndicator />
    <BgGlow />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
