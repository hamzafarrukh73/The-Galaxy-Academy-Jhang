import { z } from 'zod'

export const nameSchema = z.object({
  first_name: z.string().min(2, 'First name is too short').meta({ label: 'First Name', placeholder: 'Enter first name' }),
  last_name: z.string().min(2, 'Last name is too short').meta({ label: 'Last Name', placeholder: 'Enter last name' })
})

export const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').meta({ label: 'Phone Number', placeholder: '+92 300 1234567', class: 'col-span-2' })
})

export const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters').meta({ label: 'New Password', type: 'password', placeholder: '••••••••' }),
  confirmPassword: z.string().meta({ label: 'Confirm Password', type: 'password', placeholder: '••••••••' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword']
})
