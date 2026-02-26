<script lang="ts" setup>

</script>

<template>
  <div
    class="glow bg-neutral-600/20 dark:bg-primary-400/10"
  />
</template>

<style scoped>
.glow {
  position: fixed;
  top: 0;
  left: -10%;
  width: 120%;
  height: 40%;
  border-radius: 50%;
  filter: blur(150px);
  z-index: -1;
  pointer-events: none;
  transform: translateX(-20%)
}
</style>
