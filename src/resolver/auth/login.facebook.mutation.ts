import { Injectable } from '@nestjs/common'
import { Args, Mutation } from '@nestjs/graphql'
import { JwtModel } from '../../model/jwt.model'
import { AuthService } from '../../service/auth/auth.service'

@Injectable()
export class LoginFacebookMutation {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Mutation(() => JwtModel)
  public async loginFacebook(
    @Args('accessToken', { type: () => String}) accessToken: string
  ): Promise<JwtModel> {
    const user = await this.authService.validateFacebookToken(accessToken)

    return await this.authService.login(user)
  }
}
