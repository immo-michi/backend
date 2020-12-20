import { jobs } from './job'
import { resolvers } from './resolver'
import { services } from './service'

export const providers = [
  ...resolvers,
  ...services,
  ...jobs,
]
