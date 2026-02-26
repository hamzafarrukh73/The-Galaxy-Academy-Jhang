<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  auth: 'public',
  requiredRole: 'guest'
})
</script>

<template>
  <UContainer class="grid justify-center items-center h-[90vh]">
    <UPageSection />
  </UContainer>
</template>

<style scoped>

</style>
