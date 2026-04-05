import type { Database } from '~/types/database.types'
import { BaseRepository } from './baseRepository'

export type Guardian = Database['public']['Tables']['guardians']['Row']
export type GuardianInsert = Database['public']['Tables']['guardians']['Insert']
export type GuardianUpdate = Database['public']['Tables']['guardians']['Update']

export class GuardianRepository extends BaseRepository<'guardians', Guardian> {
  constructor() {
    super('guardians')
  }
}

export const guardianRepository = new GuardianRepository()
