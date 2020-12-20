import { Inject, UseGuards } from '@nestjs/common'
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSubEngine } from 'graphql-subscriptions'
import { PingModel } from '../model/ping.model'
import { StatusModel } from '../model/status.model'
import { JwtGuard } from '../service/auth/jwt.guard'
import { LoggerService } from '../service/logger.service'
import { VERSION } from '../version'

@Resolver(of => StatusModel)
export class StatusResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    private readonly logger: LoggerService,
  ) {
    logger.setContext(this.constructor.name)
  }

  @Query(() => StatusModel)
  status(): StatusModel {
    return new StatusModel({
      version: VERSION
    })
  }

  @Mutation(() => PingModel)
  ping(): PingModel {
    const ping = new PingModel(Date.now())

    this.pubSub.publish('pong', {
      pong: ping
    }).catch((e: Error) => this.logger.catch(e, 'publish failed'))

    return ping
  }

  @Subscription(() => PingModel)
  @UseGuards(JwtGuard)
  pong() {
    return this.pubSub.asyncIterator('pong')
  }
}
