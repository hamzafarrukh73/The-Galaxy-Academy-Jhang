import { z } from 'zod'

export const activitiesSchema = z.object({
  career_goal: z.string().optional().meta({ label: 'What do you want to be?', placeholder: 'Doctor, Software Engineer, Civil Engineer etc.', orientation: 'vertical' }),
  career_motivation: z.string().optional().meta({ label: 'Why this career specifically?', placeholder: 'Write your reason...', orientation: 'vertical' }),
  hobby: z.string().optional().meta({ label: 'Do you have a hobby?', placeholder: 'Reading Novels, Watching Netflix, Working out in GYM etc.', orientation: 'vertical' }),
  is_hafiz: z.boolean().optional().meta({ label: 'Are you Hafiz-e-Quran?', type: 'switch', orientation: 'horizontal', placeholder: ' ' })
})

export const subjectRatingSchema = z.object({
  subject_ranking: z.array(z.object({
    subject_id: z.string(),
    name: z.string(),
    rating: z.number().min(1).max(5)
  })).meta({
    class: 'lg:col-span-3'
  })
})
