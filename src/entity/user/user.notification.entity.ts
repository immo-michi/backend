import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PropertySearchFilterInput } from '../../model/property/property.search.filter.input'
import { UserEntity } from './user.entity'

@Entity('user_notification')
export class UserNotificationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity)
  user: UserEntity

  @Column()
  email: string

  @Column({ type: 'json' })
  filter: PropertySearchFilterInput
}
