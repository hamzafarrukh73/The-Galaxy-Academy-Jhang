<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const handleClearError = () => {
  clearError({ redirect: '/' })
}

const title = 'Error Occurred - The Galaxy Academy'
const description = 'Oops! Something went wrong on our end.'

useSeoMeta({
  title,
  description
})

const toaster = { position: 'top-center', duration: 3000 } as const
</script>

<template>
  <UApp :toaster="toaster">
    <div class="fixed inset-0 flex items-center justify-center overflow-hidden">
      <!-- Minimalist Background Accent -->
      <div class="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full" />
      <div class="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />

      <div class="relative z-10 text-center px-4">
        <h1 class="text-9xl font-black text-zinc-100 dark:text-zinc-900 select-none">
          {{ error.statusCode }}
        </h1>

        <div class="mt-[-2rem]">
          <h2 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {{ error.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
          </h2>
          <p class="mt-2 text-zinc-500 max-w-sm mx-auto">
            {{ error.message || 'The page you are looking for might have been moved or doesn\'t exist anymore.' }}
          </p>
        </div>

        <div class="mt-10 flex items-center justify-center gap-4">
          <UButton
            label="Go back home"
            icon="i-lucide-home"
            size="xl"
            color="primary"
            variant="solid"
            class="rounded-2xl font-bold px-8"
            @click="handleClearError"
          />
          <UButton
            label="Support"
            icon="i-lucide-help-circle"
            size="xl"
            color="neutral"
            variant="soft"
            class="rounded-2xl font-bold px-8 text-zinc-500"
            to="mailto:support@galaxy.edu"
          />
        </div>
      </div>
    </div>
  </UApp>
</template>

<style scoped>
/* Optional: prevent scrolling on error page */
body {
  overflow: hidden;
}
</style>
