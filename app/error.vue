<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const handleClearError = () => clearError({ redirect: '/' })

const toaster = { position: 'top-center', duration: 3000 } as const
</script>

<template>
  <UApp :toaster="toaster">
    <BgGlow />
    <div class="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 class="text-8xl md:text-9xl font-black opacity-10 leading-none">
        {{ error.statusCode }}
      </h1>

      <div class="mt-[-2rem] space-y-4">
        <h2 class="text-2xl font-bold">
          {{ error.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
        </h2>
        <p class="text-zinc-500 max-w-sm mx-auto">
          {{ error.message || "We encountered an unexpected error." }}
        </p>

        <div class="pt-6">
          <UButton
            label="Go back home"
            icon="i-lucide-home"
            size="xl"
            class="rounded-2xl"
            @click="handleClearError"
          />
        </div>
      </div>
    </div>
  </UApp>
</template>
