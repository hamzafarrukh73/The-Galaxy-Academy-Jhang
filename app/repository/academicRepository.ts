import type { Database } from '~/types/database.types'
import { BaseRepository } from './baseRepository'

export type Academic = Database['public']['Tables']['Academics']['Row']
export type AcademicInsert = Database['public']['Tables']['Academics']['Insert']
export type AcademicUpdate = Database['public']['Tables']['Academics']['Update']

export class AcademicRepository extends BaseRepository<'Academics', Academic> {
  constructor() {
    super('Academics')
  }
}

export const academicRepository = new AcademicRepository()
