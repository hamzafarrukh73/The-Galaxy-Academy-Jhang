import type { Database } from '~/types/database.types'

type PublicEnums = Database['public']['Enums']

export const OPTIONS = {
  cities: [
    'Jhang',
    'Lahore',
    'Islamabad',
    'Multan',
    'Karachi',
    'Chiniot',
    'Toba',
    'Sargodha',
    'Sahiwal',
    'Other'
  ] as PublicEnums['cities'][],

  provinces: [
    'Punjab',
    'Sindh',
    'Balochistan',
    'KPK'
  ] as PublicEnums['provinces'][],

  genders: [
    'Male',
    'Female'
  ] as PublicEnums['genders'][],

  classes: [
    '9th',
    '10th',
    '11th',
    '12th'
  ] as PublicEnums['classes'][],

  subject_groups: [
    'Science',
    'Arts',
    'Pre-Medical',
    'Pre-Engineering',
    'Computer Science (ICS)',
    'Commerce (I.Com)',
    'Diploma (Any Field)'
  ] as PublicEnums['subject_groups'][],

  relationships: ['Father', 'Mother', 'Uncle', 'Aunt', 'Brother', 'Sister'] as const,
  blood_groups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const,
  career_goals: ['Doctor / MBBS', 'Engineer / Engineering', 'Chartered Accountant (CA)', 'Software Developer / IT', 'Civil Services (CSS)', 'Other'] as const,
  hobbies: ['Reading', 'Coding', 'Cricket', 'Football', 'Debating / Speaking', 'Arts / Painting', 'Qira\'at / Naat', 'Other'] as const
}
