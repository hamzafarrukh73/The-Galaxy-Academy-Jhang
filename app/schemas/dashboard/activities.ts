import { z } from 'zod'

export const aspirationsSchema = z.object({
  career_aspiration: z.string().min(1, 'Please select a career goal').meta({
    label: 'Career Goal',
    type: 'select',
    items: ['Doctor / MBBS', 'Engineer / Engineering', 'Chartered Accountant (CA)', 'Software Developer / IT', 'Civil Services (CSS)', 'Other'],
    placeholder: 'What do you want to be?',
    orientation: 'vertical'
  })
})

export const hobbySchema = z.object({
  hobby: z.string().min(2, 'Please enter a hobby').meta({
    label: 'Hobby / Passion',
    placeholder: 'e.g., Reading, Coding, Cricket',
    orientation: 'vertical'
  })
})

export const discoverySchema = z.object({
  source: z.string().min(1, 'Please select how you heard about us').meta({
    label: 'How did you hear about us?',
    type: 'select',
    items: ['Social Media (Facebook/Instagram)', 'Friend / Word of Mouth', 'Flyer / Brochure', 'Newspaper Advertisement', 'Other'],
    placeholder: 'Select Source',
    orientation: 'vertical'
  })
})

export const subjectLikingSchema = z.object({
  subject_ranking: z.array(z.object({
    name: z.string(),
    liking: z.number().min(1).max(5)
  })).meta({
    class: 'lg:col-span-3'
  })
})
