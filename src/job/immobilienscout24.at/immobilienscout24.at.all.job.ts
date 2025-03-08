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
  public async cron(): Promise<void> {
    if (this.configService.get('DISABLE_IMPORT', false)) {
      this.logger.log('cron is disabled DISABLE_IMPORT')
      return
    }

    await this.execute()
  }

  @Cron('0 0 3 * * *', {
    timeZone: 'Europe/Vienna',
  })
  public async deleteOldCron(): Promise<void> {
    // older than one week!
    const deleteBefore = new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)

    // clean out all entries that are older than
    await this.hitService.deleteBefore(deleteBefore)
  }

  public async execute(): Promise<void> {
    this.logger.log('extract all pages')

    await this.processType('grund', 'grundstueck-kaufen')
    await this.processType('haus', 'haus-kaufen')
    await this.processType('haus', 'haus-mieten', true)
    await this.processType('wohnung', 'wohnung-kaufen')
    await this.processType('wohnung', 'wohnung-mieten', true)
  }

  private async processType(type: string, urlPart: string, rental: boolean = false): Promise<void> {
    const urls = this.hitService.buildUrls(urlPart)

    for(const url of urls) {
      try {
        const result = await this.hitService.list(url)

        await this.processHits(result.getDataByURL.results.hits, type, rental)

        const otherUrls = [...result.getDataByURL.results.pagination.all]
        otherUrls.shift()

        await this.processUrls(otherUrls, type, rental)
      } catch (e) {
        this.logger.catch(e, `failed to process url ${url}`)
      }
    }
  }

  private async processHits(hits: Hit[], type: string, rental: boolean): Promise<void> {
    await Promise.all(
      hits
        .map(
          hit => this.hitService
            .process(hit, type, rental)
            .catch(e => this.logger.catch(e, `failed to process expose ${hit.exposeId}`))
        )
    )
  }

  private async processUrls(urls: string[], type: string, rental: boolean): Promise<void> {
    for(const url of urls) {
      const result = await this.hitService.list(url)

      await this.processHits(result.getDataByURL.results.hits, type, rental)
    }
  }
}
