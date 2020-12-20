import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('Jwt')
export class JwtModel {
  @Field()
  readonly refresh: string

  @Field()
  readonly access: string

  constructor(accessToken: string, refreshToken: string) {
    this.refresh = refreshToken
    this.access = accessToken
  }
}
