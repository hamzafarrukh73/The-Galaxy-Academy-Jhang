import { z } from 'zod'

export const activitiesSchema = z.object({
  career_goal: z.string().optional().meta({ label: 'Career Goal', placeholder: 'What do you want to be?', orientation: 'vertical' }),
  hobby: z.string().optional().meta({ label: 'Hobbies / Passion', placeholder: 'e.g., Reading, Coding, Cricket', orientation: 'vertical' }),
  role_model: z.string().optional().meta({ label: 'Who is your Role Model?', placeholder: 'e.g., Parents, Teacher', orientation: 'vertical' }),
  inspiration: z.string().optional().meta({ label: 'What is your biggest Inspiration?', placeholder: 'Describe what motivates you', orientation: 'vertical' }),
  is_hafiz: z.boolean().optional().meta({ label: 'Are you Hafiz-e-Quran?', type: 'switch', orientation: 'horizontal', placeholder: ' ' }),
  want_job: z.boolean().optional().meta({ label: 'Do you like the idea of doing a job?', type: 'switch', orientation: 'horizontal', placeholder: ' ' })
})

export const subjectRatingSchema = z.object({
  subject_ranking: z.array(z.object({
    name: z.string(),
    liking: z.number().min(1).max(5)
  })).meta({
    class: 'lg:col-span-3'
  })
})
