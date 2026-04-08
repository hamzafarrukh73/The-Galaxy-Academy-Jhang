<script lang="ts" setup>

</script>

<template>
  <div class="fixed bottom-[10vh] right-[5vw] z-50 rounded-full">
    <UButton
      icon="i-simple-icons-whatsapp"
      size="xl"
      variant="soft"
      color="success"
      class="rounded-full"
      :to="EXTERNAL_URLS.social.whatsapp"
      target="_blank"
      :ui="{
        leadingIcon: 'size-15'
      }"
    />
  </div>
</template>

<style scoped>

</style>
