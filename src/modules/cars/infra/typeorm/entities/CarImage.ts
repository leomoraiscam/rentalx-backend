import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('cars_image')
class CarImage {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  image_name: string;

  @Column()
  car_id: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

export default CarImage;
