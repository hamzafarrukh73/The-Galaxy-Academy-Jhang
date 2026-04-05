<script lang="ts" setup>

</script>

<template>
  <div class="fixed bottom-12 right-12 z-50">
    <UButton
      icon="i-simple-icons-whatsapp"
      size="xl"
      variant="link"
      color="success"
      :to="EXTERNAL_URLS.social.whatsapp"
      target="_blank"
      :ui="{
        leadingIcon: 'size-12'
      }"
    />
  </div>
</template>

<style scoped>

</style>
