import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import 'isomorphic-fetch'
import { LoggerService } from '../../service/logger.service'
import { Immobilienscout24At } from './immobilienscout24.at'
import { Hit } from './list.query'

@Injectable()
export class Immobilienscout24AtAllJob {
  constructor(
    private readonly hitService: Immobilienscout24At,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name)
  }

  @Cron('0 0 2 * * *', {
    timeZone: 'Europe/Vienna',
  })
  public async cron(): Promise<boolean> {
    if (this.configService.get('DISABLE_IMPORT', false)) {
      this.logger.log('cron is disabled DISABLE_IMPORT')
      return
    }

    return await this.execute()
  }

  public async execute(): Promise<boolean> {
    this.logger.log('extract all pages')

    const urls = [
      '/regional/burgenland/immobilie-kaufen',
      '/regional/niederoesterreich/immobilie-kaufen',
      '/regional/wien/immobilie-kaufen',
      '/regional/steiermark/immobilie-kaufen',
      '/regional/oberoesterreich/immobilie-kaufen',
      '/regional/salzburg/immobilie-kaufen',
      '/regional/kaernten/immobilie-kaufen',
      '/regional/tirol/immobilie-kaufen',
      '/regional/vorarlberg/immobilie-kaufen',
    ]

    // older than one day!
    const deleteBefore = new Date(Date.now() - 60 * 60 * 24 * 1000)

    for(const url of urls) {
      const result = await this.hitService.list(url)

      await this.processHits(result.getDataByURL.results.hits)

      const otherUrls = [...result.getDataByURL.results.pagination.all]
      otherUrls.shift()

      await this.processUrls(otherUrls)
    }

    // clean out all entries that are older than
    await this.hitService.deleteBefore(deleteBefore)

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

  private async processUrls(urls: string[]): Promise<void> {
    for(const url of urls) {
      const result = await this.hitService.list(url)

      await this.processHits(result.getDataByURL.results.hits)
    }
  }
}
