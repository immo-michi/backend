import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PropertyEntity } from '../../entity/property/property.entity'

@ObjectType('PropertySource')
export class PropertySourceModel {
  @Field(() => ID)
  readonly id: string

  @Field()
  readonly source: string

  @Field()
  readonly link: string

  constructor(entity: PropertyEntity) {
    this.id = entity.sourceId
    this.source = entity.source
    this.link = entity.link
  }
}
