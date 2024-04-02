import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from './User';

@Entity('users_tokens')
export class UserToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'expires_date' })
  expiresDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
