import { Module } from '@nestjs/common'
import { imports } from './app.imports'
import { providers } from './app.providers'
import { HealthController } from './health.controller'

@Module({
  controllers: [HealthController],
  imports,
  providers,
})
export class AppModule {}
