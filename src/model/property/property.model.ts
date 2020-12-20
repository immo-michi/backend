import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PropertyEntity } from '../../entity/property/property.entity'

@ObjectType('Property')
export class PropertyModel {
  @Field(() => ID)
  id: number

  @Field()
  readonly name: string

  @Field({ nullable: true })
  readonly description: string

  @Field()
  readonly price: number

  @Field()
  readonly area: number

  @Field(() => [String])
  readonly images: string[]

  @Field(() => [String])
  readonly tags: string[]

  @Field()
  readonly created: Date

  @Field({ nullable: true })
  readonly updated: Date

  @Field({ nullable: true })
  readonly deleted: Date

  constructor(entity: PropertyEntity) {
    this.id = entity.id
    this.name = entity.name
    this.description = entity.description
    this.area = entity.area
    this.price = entity.price
    this.images = entity.images || []
    this.tags = entity.tags || []
    this.created = entity.created
    this.updated = entity.updated
    this.deleted = entity.deleted
  }
}
