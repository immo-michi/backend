import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserNotificationEntity } from '../entity/user/user.notification.entity'
import { LoggerService } from '../service/logger.service'
import { PropertySearchService } from '../service/property/property.search.service'
import { Immobilienscout24At } from './immobilienscout24.at/immobilienscout24.at'

@Injectable()
export class UserNotificationJob {
  constructor(
    private readonly hitService: Immobilienscout24At,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(UserNotificationEntity)
    private readonly notificationRepository: Repository<UserNotificationEntity>,
    private readonly propertySearchService: PropertySearchService,
    private readonly mailerService: MailerService,
  ) {
    this.logger.setContext(this.constructor.name)
  }

  @Cron('0 0 6 * * *', {
    timeZone: 'Europe/Vienna',
  })
  public async cron(): Promise<boolean> {
    if (this.configService.get('DISABLE_IMPORT', false)) {
      this.logger.log('cron is disabled DISABLE_IMPORT')
      return
    }

    return await this.execute()
  }

  public async execute(): Promise<boolean> {
    const notifications = await this.notificationRepository.find()

    await Promise.all(notifications.map(notifications => this.handleNotification(notifications)))

    return false
  }

  private async handleNotification(notification: UserNotificationEntity): Promise<void> {
    const [properties, total] = await this.propertySearchService.search(notification.filter, {
      offset: 0,
      limit: 100,
    })

    if (total === 0) {
      return
    }

    await this
      .mailerService
      .sendMail({
        to: notification.email,
        subject: 'IMMO Michi hat neue Immobilien gefunden!',
        text: 'Please check the HTML version of this email',
        html: `
        <h1>Es gibt ${total} neue Immobilien</h1>
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>Bezeichnung</th>
              <th>Fläche</th>
              <th>Preis</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
          ${properties.map(property => `
            <tr>
              <td><img src="${property.images[0]}" width="200" /></td>
              <td>${property.name}</td>
              <td>${property.area}m<sup>2</sup></td>
              <td>${property.price}€</td>
              <td>
                <a href="${property.link}">
                  ${property.source}
                </a>
              </td>
            </tr>`)}
          </tbody>
        </table>
        <br /><br /><br />
        <p>
          Suche wurde nach folgenden Kriterien durchgeführt: ${JSON.stringify(notification.filter)}
        </p>
          `,
      })


    console.log('found entries!!', total)
  }
}
