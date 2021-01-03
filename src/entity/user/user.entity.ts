import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  facebookId: string

  @Column()
  name: string

  @Column()
  avatar: string

  @Column()
  email: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
