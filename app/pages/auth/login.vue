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
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}]

// const providers = [{
//   label: 'Google',
//   icon: 'i-simple-icons-google',
//   onClick: () => authStore.socialGoogleLogin()
// }]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  authStore.login(payload.data)
}
</script>

<template>
  <UContainer class="w-full grid items-center py-16">
    <UPageCard class="w-full max-w-md mx-auto">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        title="Login"
        :icon="ICONS.nav.user"
        :loading="layoutStore.isLoading"
        :submit="{
          label: 'Login'
        }"
        @submit="onSubmit"
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
        <template #password-hint>
          <ULink
            :to="URLS.auth.password.reset"
            class="text-primary font-medium"
            tabindex="-1"
          >
            Forgot password?
          </ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </UContainer>
</template>
