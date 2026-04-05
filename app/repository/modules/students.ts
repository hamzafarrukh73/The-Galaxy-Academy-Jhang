import type { Tables } from '../index'

import { GenericAPI } from '../generics'

type tableKey = 'students'

export type Students = Tables[tableKey]

export default class StudentsRepository extends GenericAPI<tableKey> {
  async getByUserId(userId: string): Promise<Students['Row'] | null> {
    return await this.request<Students['Row']>(
      this.query.select('*').eq('user_id', userId).maybeSingle()
    )
  }
}
