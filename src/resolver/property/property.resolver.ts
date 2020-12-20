import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { PropertyEntity } from '../../entity/property/property.entity'
import { GeoLocationModel } from '../../model/geo.location.model'
import { KeyValueModel } from '../../model/key.value.model'
import { PropertyModel } from '../../model/property/property.model'
import { ContextCache } from '../context.cache'

@Resolver(() => PropertyModel)
export class PropertyResolver {
  @ResolveField(() => GeoLocationModel)
  public async geoLocation(
    @Parent() parent: PropertyModel,
    @Context('cache') cache: ContextCache,
  ): Promise<GeoLocationModel> {
    const property = await cache.get<PropertyEntity>(
      cache.getCacheKey(PropertyEntity.name, parent.id)
    )

    return new GeoLocationModel(property)
  }

  @ResolveField(() => [KeyValueModel])
  public async values(
    @Parent() parent: PropertyModel,
    @Context('cache') cache: ContextCache,
  ): Promise<KeyValueModel[]> {
    const property = await cache.get<PropertyEntity>(
      cache.getCacheKey(PropertyEntity.name, parent.id)
    )

    return Object.keys(property.values).map(key => {
      return new KeyValueModel(key, property.values[key])
    })
  }
}
