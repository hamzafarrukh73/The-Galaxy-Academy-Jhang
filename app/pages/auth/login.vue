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
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  link: 'auth/social'
}]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  authStore.login(payload.data, true)
}
</script>

<template>
  <UContainer class="w-full grid items-center py-16">
    <UPageCard class="w-full max-w-md mx-auto">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="providers"
        title="Login"
        :icon="ICONS.nav.user"
        @submit.prevent="onSubmit"
      >
        <template #description>
          <p>
            Don't have an account?
            <ULink
              :to="URLS.auth.registration.home"
              class="text-info font-medium"
            >
              Register here
            </ULink>
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </UContainer>
</template>
