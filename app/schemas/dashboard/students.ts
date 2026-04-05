import { z } from 'zod'

export const currentAcademicSchema = z.object({
  current_school: z.string().optional().meta({ label: 'School / College', placeholder: 'Enter Current School Name', orientation: 'vertical' }),
  current_class: z.string().optional().meta({ label: 'Class', type: 'select', items: ['9th Grade', '10th Grade', '11th Grade', '12th Grade'], placeholder: 'Select Class', orientation: 'vertical' }),
  current_group: z.string().optional().meta({ label: 'Subjects Group', type: 'select', items: ['Pre-Medical', 'Pre-Engineering', 'ICS (Physics)', 'ICS (Stats)', 'Humanities', 'Commerce'], placeholder: 'Select Group', orientation: 'vertical' }),
  current_medium: z.string().optional().meta({ label: 'Medium', type: 'select', items: ['English', 'Urdu'], placeholder: 'Select Medium', orientation: 'vertical' }),
  is_hafiz: z.boolean().optional().meta({ label: 'Hafiz-e-Quran', type: 'switch', orientation: 'horizontal' })
})

export const extraAcademicSchema = z.object({
  extra_interest: z.string().optional().meta({ label: 'Primary interest', type: 'select', items: ['Cricket', 'Football', 'Debating / Speaking', 'Arts / Painting', 'Computer Programming', 'Qira\'at / Naat', 'Other'], placeholder: 'Select Interest', orientation: 'vertical' }),
  is_volunteer: z.boolean().optional().meta({ label: 'Scout / Volunteer', type: 'switch', orientation: 'vertical' }),
  achievements: z.string().optional().meta({ label: 'Achievements', type: 'textarea', placeholder: 'List major awards', props: { rows: 2 }, orientation: 'vertical' })
})
