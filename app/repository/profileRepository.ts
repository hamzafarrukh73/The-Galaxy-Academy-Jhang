import type { Database } from '~/types/database.types'
import { BaseRepository } from './baseRepository'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export class ProfileRepository extends BaseRepository<'profiles', Profile> {
  constructor() {
    super('profiles')
  }
}

export const profileRepository = new ProfileRepository()
