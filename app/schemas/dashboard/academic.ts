import { z } from 'zod'
import { OPTIONS } from '~/utils/options'

export const academicSchema = z.object({
  last_class: z.string().optional().meta({ label: 'Last Class Passed', type: 'select', items: [...OPTIONS.classes], placeholder: 'Select Class', orientation: 'vertical' }),
  school: z.string().optional().meta({ label: 'Previous School', placeholder: 'Enter school name', orientation: 'vertical' }),
  marks_percent: z.number().min(0).max(100).optional().meta({ label: 'Marks Percentage', type: 'number', placeholder: 'Enter Percentage (e.g. 85)', orientation: 'vertical' }),
  passing_year: z.string().optional().meta({ label: 'Passing Year', placeholder: 'Enter Year (e.g. 2023)', orientation: 'vertical' })
})
