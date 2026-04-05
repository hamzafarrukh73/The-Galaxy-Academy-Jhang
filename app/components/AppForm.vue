<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { FormSubmitEvent } from '#ui/types'
import type { FieldDefinition } from '~/types/form'

/**
 * A universal and scalable form generator component.
 * Supports various field types, validation, and custom layouts.
 */

// Use defineModel to fix "Unexpected mutation of prop" linting errors
const state = defineModel<T>('state', { required: true })

const props = withDefaults(defineProps<{
  /** UI field definitions. If omitted, fields will be extracted from the schema. */
  fields?: FieldDefinition[]
  /** Zod or other validation schema */
  schema?: unknown
  /** Grid layout class for the form body */
  gridClass?: string
  /** Custom label for the default submit button */
  submitLabel?: string
  /** Whether to hide the default actions area */
  hideActions?: boolean
  /** Loading state for the submit button */
  loading?: boolean
}>(), {
  fields: undefined,
  schema: undefined,
  gridClass: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
  submitLabel: 'Submit',
  hideActions: false,
  loading: false
})

defineEmits<{
  (e: 'submit', event: FormSubmitEvent<T>): void
}>()

/**
 * Computed fields that explicitly map data out of Zod 4 using the .meta() store.
 */
const computedFields = computed(() => {
  const extracted = props.schema ? useExtractFields(props.schema) : []

  if (!props.fields) return extracted

  return props.fields.map((f) => {
    const fromSchema = extracted.find(e => e.key === f.key) || { key: f.key }
    return {
      ...fromSchema,
      ...f,
      props: { ...fromSchema.props, ...f.props }
    } as FieldDefinition
  })
})
</script>

<template>
  <UForm
    :state="state"
    :schema="props.schema"
    v-bind="$attrs"
    class="flex flex-col h-full"
    @submit="$emit('submit', $event)"
  >
    <div :class="props.gridClass">
      <template
        v-for="field in computedFields"
        :key="field.key"
      >
        <UFormField
          v-if="!field.visible || field.visible(state)"
          :label="field.label"
          :name="field.key"
          :description="field.description"
          :orientation="field.orientation || 'vertical'"
          :ui="field.ui"
          :class="field.class"
        >
          <!-- Custom item slot for specialized rendering -->
          <slot
            :name="`field-${field.key}`"
            :field="field"
            :state="state"
          >
            <!-- Select Menu -->
            <template v-if="field.type === 'select'">
              <USelectMenu
                v-model="(state[field.key as keyof T] as any)"
                :items="field.items"
                placeholder="Select"
                v-bind="field.props"
                class="w-full"
              />
            </template>

            <!-- Textarea -->
            <template v-else-if="field.type === 'textarea'">
              <UTextarea
                v-model="(state[field.key as keyof T] as string)"
                placeholder="Enter details..."
                v-bind="field.props"
                class="w-full"
                :rows="(field.props?.rows as number) || 3"
              />
            </template>

            <!-- Switch (Toggle) -->
            <template v-else-if="field.type === 'switch'">
              <div class="flex items-center gap-2 h-10">
                <USwitch
                  v-model="(state[field.key as keyof T] as boolean)"
                  v-bind="field.props"
                  color="primary"
                />
                <span
                  v-if="field.placeholder"
                  class="text-sm text-zinc-500"
                >{{ field.placeholder }}</span>
              </div>
            </template>

            <!-- Slider -->
            <template v-else-if="field.type === 'slider'">
              <div class="w-full py-2">
                <USlider
                  v-model="(state[field.key as keyof T] as number)"
                  v-bind="field.props"
                />
              </div>
            </template>

            <!-- Default Input -->
            <template v-else>
              <UInput
                v-model="(state[field.key as keyof T] as string | undefined)"
                :type="field.type === 'date' ? 'date' : (field.type || 'text')"
                :placeholder="field.placeholder || `Enter ${field.label?.toLowerCase() || ''}`"
                v-bind="field.props"
                class="w-full"
              />
            </template>
          </slot>
        </UFormField>
      </template>
    </div>

    <!-- Actions slot with a default submit button -->
    <div
      v-if="!props.hideActions || $slots.actions"
      class="mt-auto px-1 pt-6"
    >
      <slot name="actions">
        <UButton
          v-if="!props.hideActions"
          :label="props.submitLabel"
          :loading="props.loading"
          color="primary"
          variant="soft"
          size="xl"
          block
          class="rounded-xl font-bold"
          type="submit"
        />
      </slot>
    </div>
  </UForm>
</template>

<style scoped>
</style>
