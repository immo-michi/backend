import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { PropertyEntity } from '../property/property.entity'
import { UserEntity } from '../user/user.entity'
import { FavoriteListEntity } from './favorite.list.entity'

@Entity('favorite')
export class FavoriteEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => FavoriteListEntity, list => list.entries)
  list: FavoriteListEntity

  @ManyToOne(() => PropertyEntity)
  property: PropertyEntity

  @ManyToOne(() => UserEntity)
  createdBy: UserEntity

  @Column({ nullable: true })
  note?: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date

  @DeleteDateColumn()
  @Index()
  deleted?: Date
}
