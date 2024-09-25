import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'driver_license' })
  driverLicense: string;

  @Column({ name: 'is_admin' })
  isAdmin: boolean;

  @Column()
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Expose({ name: 'avatarUrl' })
  avatarUrl(): string {
    switch (process.env.DISK) {
      case 'local':
        return this.avatar
          ? `${process.env.APP_URL}:${process.env.APP_PORT}/avatar/${this.avatar}`
          : null;
      case 's3':
        return this.avatar
          ? `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`
          : null;
      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
