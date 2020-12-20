import { Module } from '@nestjs/common'
import { imports } from './app.imports'
import { providers } from './app.providers'

@Module({
  imports,
  providers,
})
export class AppModule {}
