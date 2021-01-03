import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { FavoriteEntity } from './favorite.entity'

@Entity('favorite_list')
export class FavoriteListEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => UserEntity)
  owner: UserEntity

  @OneToMany(() => FavoriteEntity, entry => entry.list)
  entries: FavoriteEntity[]

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date

  @DeleteDateColumn()
  @Index()
  deleted?: Date
}
