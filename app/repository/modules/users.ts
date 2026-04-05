import type { Tables } from '../index'

import { GenericAPI } from '../generics'

type tableKey = 'users'

export type Users = Tables[tableKey]

export default class UsersRepository extends GenericAPI<tableKey> {}
