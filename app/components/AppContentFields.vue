<script setup lang="ts">
import type { PageFeatureProps, SeparatorProps } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  /** Optional section title */
  title?: string
  /** Optional section icon */
  icon?: string
  /** Number of columns for grid layout (e.g. 2, 3, 4) */
  columns?: number | string
  /** Optional class to override the default grid styles */
  divide?: boolean | SeparatorProps[]

  class?: string
  /** Items to display */
  items: PageFeatureProps[]
}>(), {
  columns: 1,
  class: 'mx-1 gap-4'
})

/**
 * Map columns to explicit Tailwind classes for reliable mapping.
 * Nuxt UI Pro UPageGrid uses a default grid, we override the base class.
 */
const gridColsClass = computed(() => {
  const cols = Number(props.columns)
  if (cols === 1) return 'grid-cols-1!'
  return `grid-cols-${cols}! lg:grid-cols-${cols}!`
})

/**
 * Format helper for values
 */
const formatValue = (val: unknown): string => {
  if (val === null || val === undefined || val === '') return 'N/A'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (val instanceof Date) return val.toLocaleDateString()
  if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : 'None'
  return String(val)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Optional Section Header -->
    <UPageFeature
      v-if="props.title || props.icon"
      :title="props.title"
      :icon="props.icon"
      :ui="{
        root: 'flex items-center',
        title: 'text-xl'
      }"
    />

    <USeparator color="primary" />

    <UPageGrid
      :class="gridColsClass"
      :ui="{
        base: gridColsClass
      }"
    >
      <UPageFeature
        v-for="item in props.items"
        :key="item.title"
        v-bind="item"
        :description="formatValue(item.description)"
      />
    </UPageGrid>
  </div>
</template>

<style scoped>
</style>
