import { Column } from 'typeorm'

export class PropertyContactEmbedded {
  @Column({ nullable: true })
  company: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  phone: string
}
