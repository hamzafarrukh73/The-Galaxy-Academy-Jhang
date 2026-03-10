<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'minimal'
})

const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}]

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  authStore.resetPassword(payload.data.email)
}
</script>

<template>
  <UContainer class="w-full grid items-center py-16">
    <UPageCard class="w-full max-w-md mx-auto">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Reset Password"
        description="Enter your email to receive a password reset link."
        :icon="ICONS.nav.user"
        :loading="layoutStore.isLoading"
        :submit="{
          label: 'Reset'
        }"
        @submit="onSubmit"
      >
        <template #footer>
          <p class="text-center text-sm">
            Remember your password?
            <ULink
              :to="URLS.auth.login"
              class="text-info font-medium"
            >
              Login here
            </ULink>
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </UContainer>
</template>
