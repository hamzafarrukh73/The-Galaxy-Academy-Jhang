export type FieldType = 'input' | 'select' | 'textarea' | 'switch' | 'slider' | 'date' | 'email' | 'password' | 'number'

export interface FieldDefinition {
  /** The key in the state object to bind to */
  key: string
  /** The label for the field */
  label?: string
  /** Helpful description underneath the field */
  description?: string
  /** UI component type to render */
  type?: FieldType
  /** Placeholder text or switch label */
  placeholder?: string
  /** Options for select menus */
  items?: (string | number | Record<string, unknown>)[]
  /** Class for the field container (e.g., col-span in grid) */
  class?: string
  /** Additional props to pass directly to the inner component */
  props?: Record<string, unknown>
  /** UFormField UI customization */
  ui?: Record<string, unknown>
  /** Orientation of the label/field */
  orientation?: 'vertical' | 'horizontal'
  /** Function to control conditional visibility */
  visible?: (state: Record<string, unknown>) => boolean
}
