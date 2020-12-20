import { propertyResolvers } from './property'
import { StatusResolver } from './status.resolver'

export const resolvers = [
  ...propertyResolvers,
  StatusResolver,
]
