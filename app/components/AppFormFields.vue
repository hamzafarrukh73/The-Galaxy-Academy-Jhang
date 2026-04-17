<script setup lang="ts">
/**
 * A standalone field component that combines UFormField with various input types.
 * Useful for building manual forms without the AppForm generator.
 */

const props = withDefaults(defineProps<{
  /** Field label */
  label?: string
  /** Field description */
  description?: string
  /** Whether the field is required */
  required?: boolean
  /** Label orientation */
  orientation?: 'vertical' | 'horizontal'
  /** Input type (text, select, textarea, switch, date etc.) */
  type?: string
  /** Input placeholder */
  placeholder?: string
  /** Options for select type */
  items?: (string | number | Record<string, unknown>)[]
  /** Root class */
  class?: string
  /** UI overrides for UFormField */
  ui?: Record<string, unknown>
  /** Additional props for the inner input component */
  props?: Record<string, unknown>
}>(), {
  required: false,
  orientation: 'vertical',
  type: 'text',
  placeholder: '',
  items: () => [],
  class: 'w-full',
  ui: () => ({}),
  props: () => ({})
})

type FieldValue = string | number | boolean | Record<string, unknown> | undefined

const modelValue = defineModel<FieldValue>()
</script>

<template>
  <UFormField
    :label="props.label"
    :name="props.label"
    :description="props.description"
    :orientation="props.orientation"
    :required="props.required"
    :ui="{
      label: 'text-muted tracking-wider',
      ...props.ui
    }"
    :class="props.class"
  >
    <!-- Select Menu -->
    <template v-if="props.type === 'select'">
      <USelectMenu
        v-model="(modelValue as string | number | Record<string, unknown> | undefined)"
        :items="props.items"
        :placeholder="props.placeholder || 'Select'"
        v-bind="props.props"
        class="w-full"
      />
    </template>

    <!-- Textarea -->
    <template v-else-if="props.type === 'textarea'">
      <UTextarea
        v-model="(modelValue as string | number | undefined)"
        :placeholder="props.placeholder"
        v-bind="props.props"
        class="w-full"
        :rows="(props.props?.rows as number) || 3"
      />
    </template>

    <!-- Switch -->
    <template v-else-if="props.type === 'switch'">
      <USwitch
        v-model="modelValue"
        v-bind="props.props"
        color="primary"
      />
    </template>

    <!-- Default Input -->
    <template v-else>
      <UInput
        v-model="(modelValue as string | number | undefined)"
        :type="props.type === 'date' ? 'date' : (props.type || 'text')"
        :placeholder="props.placeholder || `Enter ${props.label?.toLowerCase() || ''}`"
        v-bind="props.props"
        class="w-full"
      />
    </template>
  </UFormField>
</template>

<style scoped>
</style>
