import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class PaginationInput {
  @Field(() => Int)
  offset = 0

  @Field(() => Int, { defaultValue: 20 })
  limit = 20
}
