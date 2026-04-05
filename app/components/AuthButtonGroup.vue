<script lang="ts" setup>

</script>

<template>
  <div class="flex items-center gap-1">
    <UButton
      label="Login"
      :to="URLS.auth.login"
      class="rounded-full rounded-r-none px-2 lg:px-8"
      color="primary"
      variant="soft"
    />
    <UButton
      label="Signup"
      :to="URLS.auth.registration.home"
      class="rounded-full rounded-l-none px-4 lg:px-8"
      color="primary"
      variant="solid"
    />
  </div>
</template>

<style scoped>

</style>
