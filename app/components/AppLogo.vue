<script setup lang="ts">
interface Props {
  collapsed?: boolean
  class?: string
}

defineProps<Props>()
</script>

<template>
  <img
    v-if="!collapsed"
    :src="IMAGES.logo"
    :class="['h-[5vh] aspect-4/1 object-cover object-center', $props.class]"
    alt="Logo"
  >
  <img
    v-else
    :src="IMAGES.logoCollapsed"
    :class="['h-[5vh] aspect-square object-cover object-center', $props.class]"
    alt="Logo Collapsed"
  >
</template>
