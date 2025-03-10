import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { PropertyEntity } from '../../entity/property/property.entity'
import { PaginationInput } from '../../model/pagination.input'
import { PropertySearchFilterInput } from '../../model/property/property.search.filter.input'
import { LoggerService } from '../logger.service'

@Injectable()
export class PropertySearchService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name)
  }

  public async search(filter: PropertySearchFilterInput, pager: PaginationInput): Promise<[PropertyEntity[], number]> {
    const qb = this.propertyRepository.createQueryBuilder('p')

    qb.where('p.deleted IS NULL')

    if (filter.query) {
      qb.where(
        'p.name ILIKE :query OR p.description ILIKE :query',
      ).setParameters({
        query: `%${filter.query}%`,
      })
    }

    if (filter.type) {
      qb.andWhere(
        'p.type IN (:...type)',
      ).setParameters({
        type: filter.type,
      })
    }

    if (filter.rental === true || filter.rental === false) {
      qb.andWhere(
        'p.rental = :rental',
      ).setParameters({
        rental: filter.rental,
      })
    }

    if (filter.addedSince) {
      qb.andWhere(
        'p.created >= :addedSince',
      ).setParameters({
        addedSince: new Date(Date.now() - filter.addedSince * 1000),
      })
    }

    if (filter.price && (filter.price.min || filter.price.max)) {
      qb.andWhere(
        new Brackets(qb => {
          if (filter.price.min) {
            qb.andWhere('p.price >= :priceMin', {
              priceMin: filter.price.min,
            })
          }

          if (filter.price.max) {
            qb.andWhere('p.price <= :priceMax', {
              priceMax: filter.price.max,
            })
          }
        }),
      )
    }


    if (filter.area && (filter.area.min || filter.area.max)) {
      qb.andWhere(
        new Brackets(qb => {
          if (filter.area.min) {
            qb.andWhere('p.area >= :areaMin', {
              areaMin: filter.area.min,
            })
          }

          if (filter.area.max) {
            qb.andWhere('p.area <= :areaMax', {
              areaMax: filter.area.max,
            })
          }
        }),
      )
    }

    if (filter.region) {
      if (filter.region.length === 2) {
        qb.andWhere('p.lat BETWEEN :minLat AND :maxLat AND p.lng BETWEEN :minLng AND :maxLng', {
          minLat: Math.min(...filter.region.map(p => p.lat)),
          maxLat: Math.max(...filter.region.map(p => p.lat)),
          minLng: Math.min(...filter.region.map(p => p.lng)),
          maxLng: Math.max(...filter.region.map(p => p.lng)),
        })
      }
    }

    qb.skip(pager.offset)
    qb.take(pager.limit)

    return await qb.getManyAndCount()
  }
}
