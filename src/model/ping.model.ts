import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('Ping')
export class PingModel {

  @Field()
  readonly id: number

  constructor(id) {
    this.id = id
  }
}
