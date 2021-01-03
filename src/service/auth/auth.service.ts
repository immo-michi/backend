import { HttpService, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../entity/user/user.entity'
import { JwtModel } from '../../model/jwt.model'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  public async validateFacebookToken(token: string): Promise<UserEntity> {
    const graphResult = await this.httpService.post(
      'https://graph.facebook.com/v9.0/me',
      {
        fields: 'id,name,email',
        access_token: token
      }
    ).toPromise()

    let user = await this.userRepository.findOne({
      where: {
        facebookId: graphResult.data.id
      }
    })

    if (!user) {
      user = await this.userRepository.findOne({
        where: {
          email: graphResult.data.email
        }
      })
    }

    if (!user) {
      user = new UserEntity()
      user.email = graphResult.data.email
      user.facebookId = graphResult.data.id
      user.name = graphResult.data.name

      user = await this.userRepository.save(user)
    }

    return user
  }

  public async login(user: UserEntity): Promise<JwtModel> {
    return new JwtModel(
      this.jwtService.sign({
        name: user.name,
        email: user.email,
        sub: user.id,
      }, {
        expiresIn: '48 hours'
      }),
      this.jwtService.sign({
        name: user.name,
        email: user.email,
        sub: user.id,

      }, {
        expiresIn: '70 days'
      }))
  }
}
