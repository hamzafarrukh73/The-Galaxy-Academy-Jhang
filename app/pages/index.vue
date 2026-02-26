<script lang="ts" setup>
const landingStore = useLandingStore()
</script>

<template>
  <UContainer>
    <section
      id="home"
      class="flex justify-center items-center min-h-[90vh]"
    >
      <UPageHero
        title="Academic Institute"
        description="Bridge the gap between school lessons and exams. We provide the structured environment and guidance that students need to excel in their subjects."
        orientation="vertical"
        :links="landingStore.heroLinks"
      />
    </section>

    <section
      id="benefits"
      class="flex justify-center items-center min-h-[90vh] py-16"
    >
      <UPageSection
        title="We Provide"
        description="A disciplined environment and guidance designed to help students master their curriculum."
        :features="landingStore.benefits"
      />
    </section>

    <section
      id="pricing"
      class="flex flex-col gap-12 justify-center items-center min-h-[90vh] py-16 scroll-mt-[10vh]"
    >
      <h2 class="text-center">
        Pricing Plans
      </h2>
      <UTabs :items="landingStore.pricingTabs" orientation="horizontal" class="w-full flex gap-16 p-4">
        <template #matriculation="{ item }">
           <UPricingPlans
            orientation="horizontal"
            :plans="landingStore.matriculationPlans"
            class="w-full"
          />
        </template>
        <template #intermediate="{ item }">
           <UPricingPlans
            orientation="horizontal"
            :plans="landingStore.intermediatePlans"
            class="w-full"
          />
        </template>
        <!-- <UPricingPlans
          orientation="horizontal"
          :plans="landingStore.plans"
          class="w-full"
        /> -->

      </UTabs>
    </section>

    <section
      id="get-started"
      class="flex justify-center items-center min-h-[90vh] py-16"
    >
      <UPageCTA
        title="Ready to Learn?"
        description="Secure your place in our upcoming sessions today."
        :links="landingStore.ctaLinks"
        class="w-full lg:w-fit"
        variant='naked'
      />
    </section>
  </UContainer>
</template>
