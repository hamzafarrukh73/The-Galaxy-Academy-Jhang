import type { Database } from '~/types/database.types'
import { BaseRepository } from './baseRepository'

export type Interest = Database['public']['Tables']['Interests']['Row']
export type InterestInsert = Database['public']['Tables']['Interests']['Insert']
export type InterestUpdate = Database['public']['Tables']['Interests']['Update']

export class InterestsRepository extends BaseRepository<'Interests', Interest> {
  constructor() {
    super('Interests')
  }
}

export const interestsRepository = new InterestsRepository()
