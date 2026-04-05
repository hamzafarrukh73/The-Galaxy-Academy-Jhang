import type { FieldDefinition } from '~/types/form'

/**
 * Extracts form field definitions natively from Zod v4 schemas using .meta()
 * Uses duck-typing to safely navigate the Zod schema objects without brittle version mismatches.
 */
export const useExtractFields = (schema: unknown): FieldDefinition[] => {
  if (!schema || typeof schema !== 'object') return []

  // Safely find the base schema (unwrap refines/effects)
  let baseSchema = schema as Record<string, unknown>
  while ('innerType' in baseSchema && typeof baseSchema.innerType === 'function') {
    baseSchema = baseSchema.innerType() as Record<string, unknown>
  }

  // Extract from .shape
  if (!('shape' in baseSchema) || typeof baseSchema.shape !== 'object' || !baseSchema.shape) {
    return []
  }

  const shape = baseSchema.shape as Record<string, Record<string, unknown>>

  return Object.keys(shape).map((key) => {
    const zodField = shape[key]
    if (!zodField) return { key } as FieldDefinition

    // Check if required
    const isOptional = 'isOptional' in zodField && typeof zodField.isOptional === 'function' ? zodField.isOptional() : false
    const isNullable = 'isNullable' in zodField && typeof zodField.isNullable === 'function' ? zodField.isNullable() : false
    const isRequired = !isOptional && !isNullable

    // Get .meta() data by calling the Zod 4 .meta() method
    let current = zodField
    let metaData: Record<string, unknown> = {}

    // Find base type to extract meta by safely probing the unwrapping chain
    while (current && typeof current === 'object') {
      // 1. Attempt to read .meta() directly if the method exists
      if ('meta' in current && typeof current.meta === 'function') {
        const potentialMeta = current.meta()
        if (potentialMeta && typeof potentialMeta === 'object' && Object.keys(potentialMeta).length > 0) {
          metaData = potentialMeta as Record<string, unknown>
          // We found the metadata, but we still need to unwrap to the base type to map primitive properties
          // like string/number/enum options
        }
      }

      // 2. Unwrap down one layer
      if ('innerType' in current && typeof current.innerType === 'function') {
        current = current.innerType() as Record<string, unknown>
      } else if ('removeDefault' in current && typeof current.removeDefault === 'function') {
        current = current.removeDefault() as Record<string, unknown>
      } else if ('unwrap' in current && typeof current.unwrap === 'function') {
        current = current.unwrap() as Record<string, unknown>
      } else {
        break
      }
    }

    return {
      key,
      label: (metaData.label as string) || formatLabel(key),
      description: metaData.description as string | undefined,
      placeholder: (metaData.placeholder as string | undefined) || `Enter ${formatLabel(key)}...`,
      // fallback mapping based on some simplistic logic if no meta is provided, defaulting to input
      type: (metaData.type as FieldDefinition['type']) || 'input',
      items: metaData.items as (string | number | Record<string, unknown>)[],
      class: metaData.class as string | undefined,
      props: {
        required: Boolean(isRequired),
        ...(metaData.props as Record<string, unknown> || {})
      },
      ui: metaData.ui as Record<string, unknown> | undefined,
      orientation: metaData.orientation as 'vertical' | 'horizontal' | undefined,
      visible: metaData.visible as ((state: Record<string, unknown>) => boolean) | undefined
    } as FieldDefinition
  })
}

/** Helper to format camelCase keys into Title Case labels */
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}
