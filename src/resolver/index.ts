import { authResolvers } from './auth'
import { CronMutation } from './cron.mutation'
import { favoriteResolvers } from './favorite'
import { propertyResolvers } from './property'
import { StatusResolver } from './status.resolver'

export const resolvers = [
  ...authResolvers,
  ...favoriteResolvers,
  ...propertyResolvers,
  StatusResolver,
  CronMutation,
]
