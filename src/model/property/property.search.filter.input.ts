import { Field, InputType } from '@nestjs/graphql'
import { GeoLocationInput } from '../geo.location.input'
import { NumberFilterInput } from '../number.filter.input'

@InputType()
export class PropertySearchFilterInput {
  @Field({ nullable: true })
  query?: string

  @Field({ nullable: true })
  addedSince?: number

  @Field(() => [String], { nullable: true })
  type?: string[]

  @Field(() => NumberFilterInput, { nullable: true })
  price?: NumberFilterInput

  @Field(() => NumberFilterInput, { nullable: true })
  area?: NumberFilterInput

  @Field(() => [GeoLocationInput], { nullable: true })
  region?: GeoLocationInput[]
}
