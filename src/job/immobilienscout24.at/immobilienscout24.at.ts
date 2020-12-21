import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { Client } from '@googlemaps/google-maps-services-js'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import 'isomorphic-fetch'
import stripHtml from 'string-strip-html'
import { Repository } from 'typeorm'
import { PropertyEntity } from '../../entity/property/property.entity'
import { numberExtractor } from '../../helper/number.extractractor'
import { LoggerService } from '../../service/logger.service'
import { GetDataByURL, Hit, LIST_QUERY } from './list.query'

@Injectable()
export class Immobilienscout24At {
  static SOURCE = 'immobilienscout24.at'

  private googleMaps: Client
  private client: ApolloClient<unknown>

  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name)
    this.googleMaps = new Client()
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

  public async deleteBefore(before: Date): Promise<void> {
    this.logger.log(`delete all properties before ${before.toISOString()}`)

    await this.propertyRepository.createQueryBuilder()
      .softDelete()
      .where(`updated < NOW() - INTERVAL '${Math.ceil((Date.now() - before.getTime()) / 1000)} seconds'`)
      .execute()
  }

  public async list(URL: string): Promise<GetDataByURL> {
    this.logger.log(`process list ${URL}`)

    try {
      const result = await this.client.query<GetDataByURL>({
        query: LIST_QUERY,
        variables: {
          params: {
            URL
          }
        }
      })

      return result.data
    } catch (e) {
      this.logger.catch(e, `failed to get immobililienscout24.at list by url ${URL}`)
    }

    return null
  }

  public async process(hit: Hit): Promise<PropertyEntity> {
    // load more information from page and extract "IS24AT.expose" json string!
    this.logger.log(`process expose ${hit.exposeId}`)

    let property = await this.propertyRepository.findOne({
      where: {
        source: Immobilienscout24At.SOURCE,
        sourceId: hit.exposeId,
      }
    })

    if (!property) {
      property = new PropertyEntity()
      property.sourceId = hit.exposeId
      property.source = Immobilienscout24At.SOURCE

      try {
        const gecodeResult = await this.getLocation(hit.addressString)

        property.lat = gecodeResult.lat
        property.lng = gecodeResult.lng
      } catch (e) {
        this.logger.catch(e, 'failed to extract location')

        property.lat = 0
        property.lng = 0
      }
    }

    property.address = hit.addressString
    property.name = stripHtml(hit.headline).result
    property.link = `https://www.immobilienscout24.at${hit.links.targetURL}`

    if (hit.realtorContact) {
      property.contact.company = hit.realtorContact.company
      property.contact.name = hit.realtorContact.name
    }

    property.images = []

    property.tags = hit.badges.map(badge => badge.label)

    if (hit.primaryPictureImageProps) {
      property.images.push(hit.primaryPictureImageProps.src)
    }

    if (hit.picturesImageProps) {
      hit.picturesImageProps.forEach(img => {
        property.images.push(img.src)
      })
    }

    property.area = 0

    hit.mainKeyFacts.forEach(fact => {
      property.values[fact.label] = fact.value

      if (fact.label === 'Fläche') {
        property.area = numberExtractor(fact.value)
      }
    })

    property.price = 0

    hit.priceKeyFacts.forEach(fact => {
      property.values[fact.label || 'Preis'] = fact.value

      if (!fact.label) {
        // assume this is the price!
        property.price = numberExtractor(fact.value)

      }
    })

    return await this.propertyRepository.save(property)
  }

  private async getLocation(address: string): Promise<{lat: number; lng: number}> {
    const result = await this.propertyRepository.createQueryBuilder('p')
      .select('p.lat', 'lat')
      .addSelect('p.lng', 'lng')
      .withDeleted()
      .where('p.address = :address', { address })
      .andWhere('p.lat != 0 AND p.lng != 0')
      .getRawOne()

    if (result) {
      return result
    }

    const gecodeResult = await this.googleMaps.geocode({
      params: {
        key: this.configService.get('GOOGLE_MAPS_API_KEY'),
        address,
      },
      timeout: 500,
    })

    return gecodeResult.data.results[0]?.geometry.location
  }
}
