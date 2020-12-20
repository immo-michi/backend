import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { Injectable } from '@nestjs/common'
import 'isomorphic-fetch'
import { LoggerService } from '../../service/logger.service'
import { Immobilienscout24At } from './immobilienscout24.at'
import { Hit } from './list.query'

@Injectable()
export class Immobilienscout24AtJob {
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

  public async execute(): Promise<boolean> {
    this.logger.log('extract first page')

    const urls = ['/regional/burgenland/immobilie-kaufen']

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
