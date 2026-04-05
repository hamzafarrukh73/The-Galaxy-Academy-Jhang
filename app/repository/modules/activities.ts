import type { Tables } from '../index'

import { GenericAPI } from '../generics'

type tableKey = 'activities'

export type Activities = Tables[tableKey]

export default class ActivitiesRepository extends GenericAPI<tableKey> {
  async getByStudentId(studentId: string): Promise<Activities['Row'] | null> {
    return await this.request<Activities['Row']>(
      this.query.select('*').eq('student_id', studentId).maybeSingle()
    )
  }
}
