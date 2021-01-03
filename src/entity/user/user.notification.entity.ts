import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SearchPropertyFilter } from '../../../../frontend/graphql/query/search.property.query'
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
  filter: SearchPropertyFilter
}
