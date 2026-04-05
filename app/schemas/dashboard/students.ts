import { z } from 'zod'
import { OPTIONS } from '~/utils/options'

export const currentStudentSchema = z.object({
  school: z.string().optional().meta({ label: 'School / College', placeholder: 'Enter Current School Name', orientation: 'vertical' }),
  class: z.string().optional().meta({ label: 'Class', type: 'select', items: [...OPTIONS.classes], placeholder: 'Select Class', orientation: 'vertical' }),
  subject_group: z.string().optional().meta({ label: 'Subjects Group', type: 'select', items: [...OPTIONS.subject_groups], placeholder: 'Select Group', orientation: 'vertical' })
})
