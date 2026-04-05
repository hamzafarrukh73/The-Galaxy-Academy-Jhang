import type { Tables } from '../index'

import { GenericAPI } from '../generics'

type tableKey = 'guardians'

export type Guardians = Tables[tableKey]

export default class GuardiansRepository extends GenericAPI<tableKey> {}
