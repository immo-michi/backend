import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GeoLocationInput {
  @Field()
  lat: number

  @Field()
  lng: number

  @Field({ nullable: true })
  address?: string
}
