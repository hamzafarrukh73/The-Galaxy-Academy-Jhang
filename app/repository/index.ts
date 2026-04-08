import type { Database } from '~/types/database.types'
import type { NuxtSupabaseClient } from '~/plugins/api'
import { GenericAPI } from './generics'

import AuthRepository from './modules/auth'
import UsersRepository from './modules/users'
import StudentsRepository from './modules/students'
import GuardiansRepository from './modules/guardians'
import ActivitiesRepository from './modules/activities'
import EmergencyContactsRepository from './modules/emergency_contacts'

export type Tables = Database['public']['Tables']

export const createRepository = (client: NuxtSupabaseClient) => {
  return {
    auth: new AuthRepository(client),
    users: new UsersRepository(client, 'users'),
    students: new StudentsRepository(client, 'students'),
    guardians: new GuardiansRepository(client, 'guardians'),
    emergency: new EmergencyContactsRepository(client, 'emergency_contacts'),
    activities: new ActivitiesRepository(client, 'activities'),
    subjects: new GenericAPI<'subjects'>(client, 'subjects'),
    subject_ratings: new GenericAPI<'subjects_ratings'>(client, 'subjects_ratings')
  }
}
