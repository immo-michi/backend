import { Injectable } from '@nestjs/common'
import { Args, Context, Query } from '@nestjs/graphql'
import { PropertyEntity } from '../../entity/property/property.entity'
import { PaginationInput } from '../../model/pagination.input'
import { PropertyModel } from '../../model/property/property.model'
import { PropertyPagerModel } from '../../model/property/property.pager.model'
import { PropertySearchFilterInput } from '../../model/property/property.search.filter.input'
import { PropertySearchService } from '../../service/property/property.search.service'
import { ContextCache } from '../context.cache'

@Injectable()
export class PropertyQuery {
  constructor(
    private readonly searchService: PropertySearchService,
  ) {
  }

  @Query(() => PropertyPagerModel)
  public async searchProperties(
    @Args('pager', {
      type: () => PaginationInput,
      defaultValue: new PaginationInput(),
    })
      pager: PaginationInput,
    @Args('filter', {
      type: () => PropertySearchFilterInput,
      defaultValue: new PropertySearchFilterInput(),
    })
      filter: PropertySearchFilterInput,
    @Context('cache') cache: ContextCache,
  ): Promise<PropertyPagerModel> {
    const [items, total] = await this.searchService.search(filter, pager)

    return new PropertyPagerModel({
      items: items.map(entity => {
        cache.add(cache.getCacheKey(PropertyEntity.name, entity.id), entity)
        return new PropertyModel(entity)
      }),
      total,
      offset: pager.offset,
      limit: pager.limit,
    })
  }
}
