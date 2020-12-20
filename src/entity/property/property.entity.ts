import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { PropertyContactEmbedded } from './property.contact.embedded'

@Entity('property')
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column()
  address: string

  @Column({ type: 'decimal' })
  lat: number

  @Column({ type: 'decimal' })
  lng: number

  @Column({ type: 'decimal' })
  price: number

  @Column({ type: 'decimal' })
  area: number

  @Column(() => PropertyContactEmbedded)
  contact: PropertyContactEmbedded = new PropertyContactEmbedded()

  @Column()
  link: string

  @Column({ type: 'json' })
  images: string[]

  @Column({ type: 'json' })
  tags: string[]

  @Column({ type: 'json' })
  values: {
    [key: string]: string
  } = {}

  @Column()
  source: string

  @Column()
  sourceId: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date

  @DeleteDateColumn()
  deleted?: Date
}
