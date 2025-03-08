import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name)
  }

  @Cron('0 15 9-21 * * *', {
    timeZone: 'Europe/Vienna'
  })
  public async cron(): Promise<boolean> {
    if (this.configService.get('DISABLE_IMPORT', false)) {
      this.logger.log('cron is disabled DISABLE_IMPORT')
      return
    }

    return await this.execute()
  }

  public async execute(): Promise<boolean> {
    this.logger.log('extract first page')

    await this.processType('haus', 'haus-kaufen')
    await this.processType('haus', 'haus-mieten', true)
    await this.processType('grund', 'grundstueck-kaufen')
    await this.processType('wohnung', 'wohnung-kaufen')
    await this.processType('wohnung', 'wohnung-mieten', true)

    return false
  }

  private async processType(type: string, urlPart: string, rental: boolean = false): Promise<void> {
    const urls = this.hitService.buildUrls(urlPart)

    for(const url of urls) {
      const result = await this.hitService.list(url)

      await this.processHits(result.getDataByURL.results.hits, type, rental)
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
}
