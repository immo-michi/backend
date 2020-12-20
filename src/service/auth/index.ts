import { APP_GUARD } from '@nestjs/core'
import { JwtStrategy } from './jwt.stragety'
import { OptionalJwtGuard } from './optional.jwt.guard'

export const authServices = [
  JwtStrategy,
  {
    provide: APP_GUARD,
    useClass: OptionalJwtGuard,
  },
]
