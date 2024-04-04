import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('cars_image')
export class CarImage {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'image_name' })
  imageName: string;

  @Column({ name: 'car_id' })
  carId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
