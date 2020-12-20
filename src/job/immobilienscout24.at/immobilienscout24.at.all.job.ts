import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import 'isomorphic-fetch'
import { LoggerService } from '../../service/logger.service'
import { Immobilienscout24At } from './immobilienscout24.at'
import { Hit } from './list.query'

@Injectable()
export class Immobilienscout24AtAllJob {
  private client: ApolloClient<unknown>

  constructor(
    private readonly hitService: Immobilienscout24At,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name)
    this.client = new ApolloClient({
      cache: new InMemoryCache({
        possibleTypes: {
          Listing: ['RegularListing', 'SmartPremiumListing']
        }
      }),
      link: createHttpLink({
        uri: 'https://www.immobilienscout24.at/portal/graphql',
      }),
    })
  }

  @Cron('0 0 2 * * *', {
    timeZone: 'Europe/Vienna'
  })
  public async execute(): Promise<boolean> {
    this.logger.log('extract all pages')

    const urls = ['/regional/burgenland/immobilie-kaufen']

    for(const url of urls) {
      const result = await this.hitService.list(url)

      await this.processHits(result.getDataByURL.results.hits)

      const otherUrls = [...result.getDataByURL.results.pagination.all]
      otherUrls.shift()

      await this.processUrls(otherUrls)
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

  private async processUrls(urls: string[]): Promise<void> {
    for(const url of urls) {
      const result = await this.hitService.list(url)

      await this.processHits(result.getDataByURL.results.hits)
    }
  }
}
