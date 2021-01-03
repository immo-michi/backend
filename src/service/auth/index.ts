import { APP_GUARD } from '@nestjs/core'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.stragety'
import { OptionalJwtGuard } from './optional.jwt.guard'

export const authServices = [
  AuthService,
  JwtStrategy,
  {
    provide: APP_GUARD,
    useClass: OptionalJwtGuard,
  },
]
