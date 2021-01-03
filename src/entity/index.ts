import { favoriteEntities } from './favorite'
import { propertyEntities } from './property'
import { userEntities } from './user'

export const entities = [
  ...favoriteEntities,
  ...propertyEntities,
  ...userEntities,
]
