import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { Car } from './Car';

@Entity('cars_image')
export class CarImage {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'image_name' })
  imageName: string;

  @Column({ name: 'car_id' })
  carId: string;

  @ManyToOne(() => Car, (car) => car.images)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
