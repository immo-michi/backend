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

  @Cron('0 0 3 * * *', {
    timeZone: 'Europe/Vienna',
  })
  public async deleteOldCron(): Promise<boolean> {
    // older than one week!
    const deleteBefore = new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)

    // clean out all entries that are older than
    await this.hitService.deleteBefore(deleteBefore)

    return false
  }

  public async execute(): Promise<boolean> {
    this.logger.log('extract all pages')


    await this.processType('haus', 'haus-kaufen')
    await this.processType('grund', 'grundstueck-kaufen')
    await this.processType('wohnung', 'wohnung-kaufen')

    return false
  }

  private async processType(type: string, urlPart: string): Promise<void> {
    const urls = this.hitService.buildUrls(urlPart)

    for(const url of urls) {
      try {
        const result = await this.hitService.list(url)

        await this.processHits(result.getDataByURL.results.hits, type)

        const otherUrls = [...result.getDataByURL.results.pagination.all]
        otherUrls.shift()

        await this.processUrls(otherUrls, type)
      } catch (e) {
        this.logger.catch(e, `failed to process url ${url}`)
      }
    }
  }

  private async processHits(hits: Hit[], type: string): Promise<void> {
    await Promise.all(
      hits
        .map(
          hit => this.hitService
            .process(hit, type)
            .catch(e => this.logger.catch(e, `failed to process expose ${hit.exposeId}`))
        )
    )
  }

  private async processUrls(urls: string[], type: string): Promise<void> {
    for(const url of urls) {
      const result = await this.hitService.list(url)

      await this.processHits(result.getDataByURL.results.hits, type)
    }
  }
}
