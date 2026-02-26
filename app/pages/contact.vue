<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  auth: 'public',
  requiredRole: 'guest'
})

const layoutStore = useLayoutStore()

const features = ref([
  {
    description: '+92 3147864828',
    icon: ICONS.contact.phone,
    to: ''
  },
  {
    description: 'support@' + layoutStore.websiteTitle + '.com',
    icon: ICONS.contact.mail,
    to: 'mailto: ' + 'support@' + layoutStore.websiteTitle + '.com'
  },
  {
    description: 'Monday to Friday, 9 Am to 5 PM',
    icon: ICONS.contact.clock
  }
])
</script>

<template>
  <UContainer class="grid justify-center items-center">
    <UPageSection
      headline="Contact Us"
      :features="features"
      title="We're here to help you"
      description="Need support or have question? Email, call or complete the form."
      orientation="horizontal"
    >
      <UPageCard orientation="vertical">
        <UForm class="grid grid-cols-1 gap-4">
          <!-- <UFormField label="Name" >
            <UInput placeholder="Full Name" class="w-full" />
          </UFormField> -->
          <UFormField label="Email">
            <UInput
              placeholder="Email Address"
              required
              class="w-full"
            />
          </UFormField>
          <UFormField label="Message">
            <UTextarea
              placeholder="Message"
              class="w-full"
            />
          </UFormField>
          <UButton
            type="submit"
            label="Submit"
            :ui="{
              label: 'items-center'
            }"
          />
        </UForm>
      </UPageCard>
    </UPageSection>
  </UContainer>
  <!-- <UContainer class="grid gap-16 grid-rows-[auto] grid-cols-6 p-[10%] lg:p-[5%]">
    <UContainer class="col-span-2 flex gap-4 flex-col">
      <h1 class="text-start">Get in Touch</h1>
      <h6 class="text-muted">Follow us here</h6>
      <div class="flex gap-4">
        <UButton
          v-for="(card, index) in cards"
          :key="index"
          v-bind="card"
          variant="ghost"
          color="neutral"
          class="flex flex-col"
        />
      </div>
    </UContainer>
    <UContainer class="col-span-2">
      <UPageCard title="Send us your message" orientation="vertical" >
        <UForm class="grid grid-cols-1 gap-3">
          <UFormField label="Name" >
            <UInput placeholder="Full Name" />
          </UFormField>
          <UFormField label="Email">
            <UInput placeholder="Email Address" />
          </UFormField>
          <UFormField label="Subject">
            <UInput placeholder="Subject" />
          </UFormField>
          <UFormField label="Message">
            <UTextarea placeholder="Message" />
          </UFormField>
          <UButton label="Submit" />
        </UForm>
      </UPageCard>
    </UContainer>
  </UContainer> -->
</template>

<style scoped></style>
