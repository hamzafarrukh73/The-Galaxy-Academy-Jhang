import { z } from 'zod'
import { OPTIONS } from '~/utils/options'

export const identitySchema = z.object({
  first_name: z.string().optional().meta({ label: 'First Name', placeholder: 'Enter your name' }),
  last_name: z.string().optional().meta({ label: 'Last Name', placeholder: 'Enter your last name' }),
  cnic: z.string().optional().meta({ label: 'CNIC / B-Form', placeholder: '33202-1234567-1' }),
  dob: z.string().optional().meta({ label: 'Date of Birth', type: 'date' }),
  gender: z.string().optional().meta({ label: 'Gender', type: 'select', items: [...OPTIONS.genders] })
})

export const guardianSchema = z.object({
  name: z.string().optional().meta({ label: 'Guardian Name', placeholder: 'Enter guardian\'s full name' }),
  relationship: z.string().optional().meta({ label: 'Relationship', type: 'select', items: [...OPTIONS.relationships] }),
  cnic: z.string().optional().meta({ label: 'CNIC', placeholder: '33202-1234567-1' }),
  email: z.email('Invalid email address').optional().or(z.literal('')).meta({ label: 'Email Address', type: 'email', placeholder: 'guardian@example.com' }),
  phone: z.string().optional().meta({ label: 'Mobile Number', placeholder: '03xx-xxxxxxx' }),
  is_whatsapp: z.boolean().meta({ label: 'WhatsApp Availability', type: 'switch', placeholder: 'Available on WhatsApp', class: 'flex flex-col justify-end' })
})

export const emergencySchema = z.object({
  emergency_name: z.string().optional().meta({ label: 'Contact Person Name', placeholder: 'Enter name' }),
  emergency_phone: z.string().optional().meta({ label: 'Mobile Number', placeholder: '03xx-xxxxxxx' }),
  emergency_relationship: z.string().optional().meta({ label: 'Relationship', type: 'select', items: [...OPTIONS.relationships] })
})

export const addressSchema = z.object({
  address: z.string().optional().meta({ type: 'textarea', placeholder: 'House/Street, Area', class: 'lg:col-span-2' }),
  city: z.string().optional().meta({ label: 'City', type: 'select', items: [...OPTIONS.cities] }),
  province: z.string().optional().meta({ label: 'Province', type: 'select', items: [...OPTIONS.provinces] })
})
