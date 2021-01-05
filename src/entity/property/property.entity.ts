import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { PropertyContactEmbedded } from './property.contact.embedded'

@Entity('property')
@Index(['source', 'sourceId'], { unique: true })
@Index(['lat', 'lng'])
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  type: string

  @Column()
  address: string

  @Column({ type: 'decimal' })
  lat: number

  @Column({ type: 'decimal' })
  lng: number

  @Column({ type: 'decimal' })
  @Index()
  price: number

  @Column({ type: 'decimal' })
  @Index()
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
  @Index()
  deleted?: Date
}
