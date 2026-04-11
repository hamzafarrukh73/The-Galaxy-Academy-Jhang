<script lang="ts" setup>
definePageMeta({
  navGroup: 'landing'
})
const landingStore = useLandingStore()
</script>

<template>
  <UContainer class="flex flex-col gap-12">
    <UPageHero
      id="home"
      title="Academic Institute"
      description="Bridge the gap between school lessons and exams. We provide the structured environment and guidance that students need to excel in their subjects."
      orientation="vertical"
      :links="landingStore.heroLinks"
      class="flex items-center justify-center min-h-[90vh] scroll-mt-[15vh]"
    />

    <UPageSection
      id="benefits"
      title="We Provide"
      :features="landingStore.benefits"
      class="flex items-center justify-center min-h-[90vh]"
    />

    <!-- <UPageSection
      id="pricing"
      title="Pricing Plans"
      class="flex flex-col items-center justify-center gap-12 min-h-[90vh]"
    >
      <UTabs
        :items="landingStore.pricingTabs"
        orientation="horizontal"
        class="flex gap-12 w-full"
      >
        <template #matriculation>
          <UPricingPlans
            orientation="horizontal"
            :plans="landingStore.matriculationPlans"
            class="w-full"
          />
        </template>
        <template #intermediate>
          <UPricingPlans
            orientation="horizontal"
            :plans="landingStore.intermediatePlans"
            class="w-full"
          />
        </template>
      </UTabs>
    </UPageSection> -->

    <!-- <section
      id="get-started"
      class="flex justify-center items-center min-h-[60vh] py-16"
    >
      <UPageCTA
        title="Ready to Learn?"
        description="Secure your place in our upcoming sessions today."
        :links="landingStore.ctaLinks"
        class="w-full lg:w-fit"
        variant="naked"
      />
    </section> -->

    <UPageSection
      id="contact"
      headline="Contact Us"
      :features="landingStore.contacts"
      title="We're here to help you"
      description="Need support or have question? Email or call us."
      orientation="horizontal"
      class="flex items-center justify-center min-h-[80vh]"
    >
      <UPageCard
        title="Frequently Asked Questions"
        variant="naked"
        class="py-8 lg:py-4"
      >
        <UAccordion :items="landingStore.faqs" />
      </UPageCard>
    </UPageSection>

    <FloatingButton />
  </UContainer>
</template>
