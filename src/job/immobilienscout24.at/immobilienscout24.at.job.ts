import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import 'isomorphic-fetch'
import { LoggerService } from '../../service/logger.service'
import { Immobilienscout24At } from './immobilienscout24.at'
import { Hit } from './list.query'

@Injectable()
export class Immobilienscout24AtJob {
  constructor(
    private readonly hitService: Immobilienscout24At,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name)
  }

  @Cron('0 15 9-21 * * *', {
    timeZone: 'Europe/Vienna'
  })
  public async execute(): Promise<boolean> {
    this.logger.log('extract first page')

    const urls = [
      '/regional/burgenland/immobilie-kaufen',
      '/regional/niederoesterreich/immobilie-kaufen',
    ]

    for(const url of urls) {
      const result = await this.hitService.list(url)

      await this.processHits(result.getDataByURL.results.hits)
    }

    return false
  }

  private async processHits(hits: Hit[]): Promise<void> {
    await Promise.all(
      hits
        .map(
          hit => this.hitService
            .process(hit)
            .catch(e => this.logger.catch(e, `failed to process expose ${hit.exposeId}`))
        )
    )
  }
}
