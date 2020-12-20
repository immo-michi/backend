import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('GeoLocation')
export class GeoLocationModel {
  @Field()
  readonly lat: number

  @Field()
  readonly lng: number

  @Field({ nullable: true })
  readonly address?: string

  constructor(part: Partial<GeoLocationModel>) {
    this.lat = part.lat
    this.lng = part.lng
    this.address = part.address
  }
}
