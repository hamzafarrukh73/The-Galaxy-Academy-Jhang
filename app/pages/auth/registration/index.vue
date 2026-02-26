<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'empty'
})

const authStore = useAuthStore()

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Email',
  required: true
}, {
  name: 'password1',
  label: 'Password',
  type: 'password',
  placeholder: 'Password',
  required: true
}, {
  name: 'password2',
  label: 'Confirm Password',
  type: 'password',
  placeholder: 'Confirm Password',
  required: true
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  link: 'auth/social'
}]

const schema = z.object({
  email: z.email('Invalid email'),
  password1: z.string('Password is required').min(8, 'Must be at least 8 characters'),
  password2: z.string('Confirm Password is required').min(8, 'Must be at least 8 characters')
}).refine((data) => {
  return data.password1 === data.password2
}, {
  message: 'Passwords do not match.',
  path: ['password2']
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  authStore.register(payload.data, true, URLS.auth.login)
}
</script>

<template>
  <UContainer class="w-full grid items-center py-16">
    <UPageCard class="w-full max-w-md mx-auto">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="providers"
        title="Signup"
        :icon="ICONS.nav.user"
        @submit.prevent="onSubmit"
      >
        <template #description>
          <p>
            Already have an account?
            <ULink
              :to="URLS.auth.login"
              class="text-info font-medium"
            >
              Login here
            </ULink>
          </p>
        </template>
        <template #footer>
          <p>
            By signing up, you agree to our
            <ULink
              to="#"
              class="text-info font-medium"
            >
              Terms of Service
            </ULink>
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </UContainer>
</template>
