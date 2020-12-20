import { Controller, Get } from '@nestjs/common'

@Controller()
export class HealthController {
  @Get('_health')
  root(): string {
    return 'ok'
  }
}
