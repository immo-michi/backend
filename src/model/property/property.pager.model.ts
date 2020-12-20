import { ObjectType } from '@nestjs/graphql'
import { PagerBuilder, PagerData } from '../pager.builder'
import { PropertyModel } from './property.model'

@ObjectType('PropertyPager')
export class PropertyPagerModel extends PagerBuilder(PropertyModel) {
  constructor(partial: PagerData<PropertyModel>) {
    super(partial)
  }
}
