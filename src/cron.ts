import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
// import { CoreModule } from './core/core.module';

(async () => {
  // tslint:disable-next-line:no-console
  console.info('please wait while initializing modules')
  const app = await NestFactory.create(AppModule)
  const arg = process.argv[2]
  // const cron = app.select(CoreModule).get(arg, { strict: true });
  const cron = app.get(arg)

  if (!cron.execute) {
    // tslint:disable-next-line:no-console
    console.error('INVALID CRON CALL', cron)
    process.exit()
    return
  }

  // tslint:disable-next-line:no-console
  console.log('start execution of ' + arg)
  if (await cron.execute()) {
    // tslint:disable-next-line:no-console
    console.info('successful execution, do not execute again in live')
  } else {
    // tslint:disable-next-line:no-console
    console.info('successful execution, keep regular execution schedule')
  }

  process.exit()
})().catch((e: Error) => console.error('unknown error', e))
