<script lang="ts" setup>
import type { PricingPlanProps } from '@nuxt/ui'

definePageMeta({
  layout: 'default',
  auth: 'public',
  requiredRole: 'guest'
})

const plans = ref<PricingPlanProps[]>([
  {
    title: 'Free',
    description: 'Signup and get free access.',
    price: '$0',
    billingCycle: '/month',
    features: [
      '$5 Credits',
      'Lifetime access'
    ],
    button: {
      label: 'Try now',
      to: URLS.auth.registration.home
    }
  },
  {
    title: 'Basic',
    description: 'Coming Soon...',
    price: 'N/A',
    features: [
      'Coming Soon...'
    ],
    button: {
      label: 'Coming Soon...'
    }
  },
  {
    title: 'Premium',
    description: 'Coming Soon...',
    price: 'N/A',
    features: [
      'Coming Soon...'
    ],
    button: {
      label: 'Coming Soon...'
    }
  }
])
</script>

<template>
  <UContainer class="grid gap-16 grid-rows-[auto_1fr] p-[10%] lg:p-[5%]">
    <div class="flex flex-col gap-8">
      <h1 class="text-center">
        Pricing Plans
      </h1>
      <h5 class="text-center text-muted font-thin">
        Signup to start a free trial. No Credit Card required.
      </h5>
      <!-- <USeparator orientation="horizontal" /> -->
    </div>
    <UPricingPlans
      orientation="horizontal"
      :plans="plans"
    />
  </UContainer>
</template>

<style scoped>

</style>
