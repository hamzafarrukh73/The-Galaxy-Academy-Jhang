<script lang="ts" setup>

</script>

<template>
  <div
    class="glow fixed -z-10 h-[40%] w-[120%] blur-[120px] drop-shadow-xl bg-neutral-600/20 dark:bg-primary-400/10"
  />
</template>

<style scoped>
.glow {
  position: fixed;
  top: 0;
  left: 10%;
  width: 120%;
  height: 40%;
  border-radius: 75%;
  /* filter: blur(150px); */
  z-index: -10;
  pointer-events: none;
  transform: translateX(-20%)
}
</style>
