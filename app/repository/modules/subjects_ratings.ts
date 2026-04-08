import type { Tables } from '../index'

import { GenericAPI } from '../generics'

type tableKey = 'subjects_ratings'

export type SubjectsRatings = Tables[tableKey]

export default class SubjectsRatingsRepository extends GenericAPI<tableKey> {}
