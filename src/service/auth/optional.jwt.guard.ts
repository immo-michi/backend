import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { ContextCache } from '../../resolver/context.cache'

export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    return user
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<any>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context)

      if (!ctx.getContext().cache) {
        ctx.getContext().cache = new ContextCache()
      }

      return ctx.getContext().req
    }

    return context.switchToHttp().getRequest()
  }
}
