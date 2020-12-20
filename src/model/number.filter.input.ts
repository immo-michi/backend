import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class NumberFilterInput {
  @Field({ nullable: true })
  min?: number

  @Field({ nullable: true })
  max?: number
}
