import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('KeyValue')
export class KeyValueModel {
  @Field()
  readonly key: string

  @Field()
  readonly value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }

}
