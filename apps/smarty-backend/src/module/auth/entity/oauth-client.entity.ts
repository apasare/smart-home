import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class OauthClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  secret: string;

  @Column({
    type: 'json',
    default: '[]',
  })
  redirectUris: string[] = [];

  @Column({
    type: 'json',
    default: '[]',
  })
  grants: string[] = [];

  @Column({
    nullable: true,
  })
  accessTokenLifetime: number;

  @Column({
    nullable: true,
  })
  refreshTokenLifetime: number;

  @ManyToOne(() => User, (user) => user.clients, { nullable: true })
  user: User | null = null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
