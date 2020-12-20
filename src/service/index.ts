import { ConfigService } from '@nestjs/config'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PubSub, PubSubEngine } from 'graphql-subscriptions'
import Redis from 'ioredis'
import { authServices } from './auth'
import { LoggerService } from './logger.service'
import { propertyServices } from './property'

export const services = [
  ...authServices,
  ...propertyServices,
  LoggerService,
  {
    provide: 'PUB_SUB',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): PubSubEngine => {
      const host = configService.get<string>('REDIS_HOST')
      const port = configService.get<number>('REDIS_PORT', 6379)

      if (!host) {
        return new PubSub()
      }

      const options = {
        host,
        port,
      }

      return new RedisPubSub({
        publisher: new Redis(options),
        subscriber: new Redis(options),
      })
    }
  },
]
