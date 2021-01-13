import { Injectable, } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { Args, Mutation } from '@nestjs/graphql'

@Injectable()
export class CronMutation {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly configService: ConfigService,
  ) {
  }

  @Mutation(() => String)
  startCron(
    @Args('name') name: string,
    @Args('action') action: string,
    @Args('token') token: string,
  ): string {
    if (!this.checkToken(token)) {
      return 'not allowed to execute'
    }

    try {
      const cron = this.moduleRef.get(name)

      void cron[action]()
    } catch (e) {
      return 'could not find cron'
    }

    return 'execution started'
  }

  private checkToken(token: string): boolean {
    const compareToken = this.configService.get('GRAPHQL_CRON_TOKEN')

    if (!compareToken) {
      return false
    }

    return compareToken === token
  }
}
