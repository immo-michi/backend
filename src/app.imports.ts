import { MailerModule, MailerOptions } from '@nestjs-modules/mailer'
import { HttpModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Request } from 'express-serve-static-core'
import { IncomingHttpHeaders } from 'http'
import { join } from 'path'
import { types } from 'pg'
import { entities } from './entity'

types.setTypeParser(types.builtins.NUMERIC, (value: string): number => parseFloat(value))

export const imports = [
  HttpModule,
  PassportModule,
  ConfigModule.forRoot(),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): JwtModuleOptions => ({
      secret: configService.get('JWT_SECRET', 'not-so-secret'),
      signOptions: {
        expiresIn: '60s',
        issuer: configService.get('JWT_ISSUER', 'immo.ms07.at'),
      },
    })
  }),
  MailerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): MailerOptions => ({
      transport: configService.get('MAILER_URI','smtp://localhost:1025'),
      defaults: {
        from: configService.get('MAILER_FROM', '"Immo Michi" <noreply@local>'),
      },
    }),
  }),
  GraphQLModule.forRoot({
    debug: process.env.NODE_ENV !== 'production',
    definitions: {
      outputAs: 'class',
    },
    tracing: process.env.NODE_ENV !== 'production',
    introspection: true,
    playground: true,
    installSubscriptionHandlers: true,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    // to allow guards on resolver props https://github.com/nestjs/graphql/issues/295
    fieldResolverEnhancers: [
      'guards',
      'interceptors',
    ],
    context: ({ req, connection }) => {
      if (!req && connection) {
        const headers: IncomingHttpHeaders = {}

        Object.keys(connection.context).forEach(key => {
          headers[key.toLowerCase()] = connection.context[key]
        })

        console.log('extended reququest', req)

        return {
          req: {
            headers
          } as Request
        }
      }

      return { req }
    },
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
      type: 'postgres',
      host: configService.get<string>('TYPEORM_HOST', 'localhost'),
      port: configService.get<number>('TYPEORM_PORT', 5432),
      username: configService.get<string>('TYPEORM_USERNAME', 'immo'),
      password: configService.get<string>('TYPEORM_PASSWORD', 'immo'),
      database: configService.get<string>('TYPEORM_DATABASE', 'immo'),
      logging: configService.get<string>('TYPEORM_LOGGING', 'false') === 'true',
      entities,
      migrationsTableName: 'nest_migrations',
      migrations: [
        `${__dirname}/**/migrations/**{.ts,.js}`,
      ],
      migrationsRun: configService.get<boolean>('TYPEORM_RUN_MIGRATIONS', false),
    }),
  }),
  TypeOrmModule.forFeature(entities),
  ScheduleModule.forRoot(),
]
