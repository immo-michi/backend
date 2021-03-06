import { Injectable, Logger, Scope } from '@nestjs/common'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  catch(e: Error, message?: string) {
    this.error(message || e.message, e.stack)
  }
}
