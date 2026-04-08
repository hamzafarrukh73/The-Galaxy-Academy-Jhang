import type { Tables } from '../index'
import { GenericAPI } from '../generics'

type tableKey = 'emergency_contacts'

export type EmergencyContacts = Tables[tableKey]

export default class EmergencyContactsRepository extends GenericAPI<tableKey> {
  async getByStudentId(studentId: string): Promise<EmergencyContacts['Row'] | null> {
    return await this.request<EmergencyContacts['Row']>(
      this.query.select('*').eq('student_id', studentId).maybeSingle()
    )
  }
}
