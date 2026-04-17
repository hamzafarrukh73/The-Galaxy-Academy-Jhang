import type { Database } from '~/types/database.types'

type PublicEnums = Database['public']['Enums']

export const OPTIONS = {
  cities: [
    'Jhang',
    'Faisalabad',
    'Lahore',
    'Islamabad'
  ] as PublicEnums['city_enum'][],

  provinces: [
    'Punjab',
    'Sindh',
    'Balochistan',
    'KPK'
  ] as PublicEnums['province_enum'][],

  genders: [
    'Male',
    'Female'
  ] as PublicEnums['gender_enum'][],

  classes: [
    '5th',
    '8th',
    '9th',
    '10th',
    '11th',
    '12th',
    'Other'
  ] as PublicEnums['class_enum'][],

  subject_groups: [
    'Science (Biology)',
    'Science (Computer)',
    'FSc. (Pre-Medical)',
    'FSc. (Pre-Engineering)',
    'ICS (Computer Science)',
    'I.Com (Commerce)',
    'F.A. (Arts)',
    'Diploma'
  ] as PublicEnums['subject_group_enum'][],

  relationships: [
    'Father',
    'Mother',
    'GrandFather',
    'GrandMother',
    'Uncle',
    'Aunt',
    'Brother',
    'Sister',
    'Other'
  ] as PublicEnums['relationship_enum'][],
  blood_groups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const,
  career_goals: ['Doctor / MBBS', 'Engineer / Engineering', 'Chartered Accountant (CA)', 'Software Developer / IT', 'Civil Services (CSS)', 'Other'] as const,
  hobbies: ['Reading', 'Coding', 'Cricket', 'Football', 'Debating / Speaking', 'Arts / Painting', 'Qira\'at / Naat', 'Other'] as const
}
