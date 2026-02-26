<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const route = useRoute()
const key = route.query.key as string || ''

const verify = (key !== '') || false
if (verify) {
  authStore.verifyEmail(key)
}

const email = ref('')
</script>

<template>
  <UContainer class="w-full grid items-center">
    <UPageCard
      v-if="verify"
      class="w-full max-w-md mx-auto"
    />
    <UPageCard
      v-else
      title="Resend Verification Email"
      class="w-full max-w-md mx-auto"
    >
      <div class="w-full flex gap-2">
        <UInput
          v-model="email"
          type="text"
          placeholder="Email"
          class="grow"
        />
        <UButton
          label="Resend"
          @click="authStore.resendVerificationEmail(email)"
        />
      </div>
    </UPageCard>
  </UContainer>
</template>

<style scoped>

</style>
