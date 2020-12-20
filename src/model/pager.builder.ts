import { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'

export interface PagerData<T = any> {
  readonly items: T[]
  readonly total: number
  readonly offset: number
  readonly limit: number
}

export const PagerBuilder = <T>(classRef: Type<T>): any => {
  @ObjectType({ isAbstract: true })
  abstract class PagerType {
    @Field(() => [classRef], { nullable: true })
    public readonly items: T[]

    @Field(() => Int)
    public readonly total: number

    @Field(() => Int)
    public readonly offset: number

    @Field(() => Int)
    public readonly limit: number

    protected constructor(current: PagerData<T>) {
      this.items = current.items
      this.total = current.total
      this.offset = current.offset
      this.limit = current.limit
    }
  }
  return PagerType
}
