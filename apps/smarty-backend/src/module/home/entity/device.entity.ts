import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  physicalId: string;

  @Column()
  name: string;

  @Column()
  adapter: string;

  @Column()
  address: string;

  @Column({ type: 'json' })
  additionalData: unknown;
}
