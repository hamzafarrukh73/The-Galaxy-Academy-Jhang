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
  items?: PageFeatureProps[]
}>(), {
  columns: 1,
  class: 'gap-4 mx-1'
})

/**
 * Map columns to explicit Tailwind classes for reliable mapping.
 * Nuxt UI Pro UPageGrid uses a default grid, we override the base class.
 */
const gridColsClass = computed(() => {
  const cols = Number(props.columns)
  if (cols === 1) return 'grid-cols-1!'
  if (cols === 2) return 'grid-cols-2!'
  if (cols === 4) return 'grid-cols-4!'
  return `grid-cols-3! lg:grid-cols-3!`
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
  <div class="flex flex-col gap-4  w-full">
    <!-- Optional Section Header -->
    <UPageFeature
      v-if="props.title || props.icon"
      :title="props.title"
      :icon="props.icon"
      :ui="{
        root: 'flex items-start',
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
      <slot>
        <UPageFeature

          v-for="item in props.items"
          :key="item.title"
          v-bind="item"
          :description="formatValue(item.description)"
        />
      </slot>
    </UPageGrid>
  </div>
</template>

<style scoped>
</style>
