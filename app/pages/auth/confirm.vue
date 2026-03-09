<script setup lang="ts">
import { URLS } from '~/utils/urls'

/**
 * Supabase Auth Confirmation Page
 * Handles redirects after email verification or OAuth login
 */

const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo(URLS.home)
  }
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <UIcon
      name="i-heroicons-arrow-path"
      class="animate-spin size-12 text-primary"
    />
    <p class="text-lg font-medium">
      Verifying your session...
    </p>
    <p class="text-neutral-500">
      Please wait while we log you in.
    </p>
  </div>
</template>
