import { Injectable } from '@nestjs/common'
import { Args, Mutation } from '@nestjs/graphql'
import { JwtModel } from '../../model/jwt.model'

@Injectable()
export class LoginFacebookMutation {
  @Mutation(() => JwtModel)
  public async loginFacebook(
    @Args('accessToken', { type: () => String}) accessToken: string
  ): Promise<JwtModel> {
    // TODO implement FB Auth
    return new JwtModel('1', '2')
  }
}
