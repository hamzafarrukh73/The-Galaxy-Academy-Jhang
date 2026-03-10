<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'minimal'
})

const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const fields: AuthFormField[] = [{
  name: 'password',
  label: 'New Password',
  type: 'password',
  placeholder: 'Enter your new password',
  required: true
}, {
  name: 'confirmPassword',
  label: 'Confirm Password',
  type: 'password',
  placeholder: 'Confirm your new password',
  required: true
}]

const schema = z.object({
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Must be at least 8 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  authStore.confirmPasswordReset(payload.data.password)
}
</script>

<template>
  <UContainer class="w-full grid items-center py-16">
    <UPageCard class="w-full max-w-md mx-auto">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Change Password"
        description="Enter your new password below."
        :icon="ICONS.nav.user"
        :loading="layoutStore.isLoading"
        :submit="{
          label: 'Update password'
        }"
        @submit="onSubmit"
      />
    </UPageCard>
  </UContainer>
</template>
